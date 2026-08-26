using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartStay.Core.Interfaces.Repositories;
using SmartStay.Core.Interfaces.Services;
using SmartStay.Data.Repositories;
using SmartStay.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// 1. Servis Yapilandirmasi (Dependency Injection)
// ---------------------------------------------------------------------------

// Controller ve JSON yapilandirmasi
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
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
// 2. HTTP Istek Isleme Hatti (Middleware Pipeline)
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
