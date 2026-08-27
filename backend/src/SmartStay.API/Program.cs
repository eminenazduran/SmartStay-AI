using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartStay.Core.Interfaces.Repositories;
using SmartStay.Core.Interfaces.Services;
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

// OpenAPI & Swagger Yapilandirmasi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Politikasi (React frontend icin)
builder.Services.AddCors(options =>
{
    options.AddPolicy("SmartStayCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Katman Servis Kayitlari (DI)
builder.Services.AddScoped<IListingsRepository, ListingsRepository>();
builder.Services.AddScoped<IListingsService, ListingsService>();

// FastAPI ML Servisi Istemcisi (Typed HttpClient)
var mlBaseUrl = builder.Configuration["MlService:BaseUrl"] ?? "http://127.0.0.1:8000";
builder.Services.AddHttpClient<IMlServiceClient, MlServiceClient>(client =>
{
    client.BaseAddress = new Uri(mlBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(15);
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// 2. Veritabani Migrasyon ve Seed Islemi (Startup)
// ---------------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        logger.LogInformation("MSSQL Veritabani baglantisi ve migrasyonlar kontrol ediliyor...");
        await context.Database.MigrateAsync();
        logger.LogInformation("Veritabani migrasyonlari guncel. CSV Seed kontrol ediliyor...");
        await DataSeeder.SeedAsync(context, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Veritabani baslatma ve seed sirasinda hata olustu: {Message}", ex.Message);
    }
}

// ---------------------------------------------------------------------------
// 3. HTTP Istek Isleme Hatti (Middleware Pipeline)
// ---------------------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("SmartStayCorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
