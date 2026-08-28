using System;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartStay.API.Middlewares;
using SmartStay.Core.Interfaces.Repositories;
using SmartStay.Core.Interfaces.Services;
using SmartStay.Core.Validators;
using SmartStay.Data.Context;
using SmartStay.Data.Repositories;
using SmartStay.Data.Seed;
using SmartStay.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// 1. Servis Yapilandirmasi (Dependency Injection)
// ---------------------------------------------------------------------------

// Veritabani Yapilandirmasi (EF Core & MSSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.\\SQLEXPRESS;Database=SmartStayDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null);
        sqlOptions.CommandTimeout(60);
    });
});

// Controller ve JSON yapilandirmasi
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// FluentValidation Dogrulayicilarinin Kaydi
builder.Services.AddValidatorsFromAssemblyContaining<PricePredictionRequestValidator>();

// OpenAPI & Swagger Dökümantasyonu Yapılandırması
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // XML Yorum Satırlarının Swagger'a Dahil Edilmesi
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// CORS Politikası (React frontend için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("SmartStayCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Katman Servis Kayıtları (DI)
builder.Services.AddScoped<IListingsRepository, ListingsRepository>();
builder.Services.AddScoped<IListingsService, ListingsService>();

// FastAPI ML Servisi İstemcisi (Typed HttpClient)
var mlBaseUrl = builder.Configuration["MlService:BaseUrl"] ?? "http://127.0.0.1:8000";
builder.Services.AddHttpClient<IMlServiceClient, MlServiceClient>(client =>
{
    client.BaseAddress = new Uri(mlBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(15);
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// 2. Global Hata Yönetimi Middleware (En Başta)
// ---------------------------------------------------------------------------
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

// ---------------------------------------------------------------------------
// 3. Veritabani Migrasyon ve Seed Islemi (Startup)
// ---------------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
        await DataSeeder.SeedAsync(context, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Veritabani baslatma veya seed sirasinda hata olustu: {Message}", ex.Message);
    }
}

// ---------------------------------------------------------------------------
// 4. HTTP İstek İşleme Hattı (Pipeline) & Swagger
// ---------------------------------------------------------------------------

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartStay AI API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("SmartStayCorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
