# SmartStay AI — ASP.NET Core Web API Multi-stage Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Proje dosyalarını kopyala ve restore et
COPY ["backend/src/SmartStay.Core/SmartStay.Core.csproj", "SmartStay.Core/"]
COPY ["backend/src/SmartStay.Data/SmartStay.Data.csproj", "SmartStay.Data/"]
COPY ["backend/src/SmartStay.Services/SmartStay.Services.csproj", "SmartStay.Services/"]
COPY ["backend/src/SmartStay.API/SmartStay.API.csproj", "SmartStay.API/"]

RUN dotnet restore "SmartStay.API/SmartStay.API.csproj"

# Tüm kaynak kodları kopyala ve yayınla
COPY backend/src/ .
WORKDIR "/src/SmartStay.API"
RUN dotnet publish "SmartStay.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime imajı
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .

# CSV seed verisini çalışma dizinine kopyala
COPY data_science/data/processed/cleaned_listings.csv /app/data_science/data/processed/cleaned_listings.csv

ENV ASPNETCORE_URLS=http://+:5018
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5018

ENTRYPOINT ["dotnet", "SmartStay.API.dll"]
