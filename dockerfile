FROM ubuntu/dotnet-aspnet:8.0-24.04_stable as base
WORKDIR /

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["rental_project/rental_project.csproj", "rental_project/"]
RUN dotnet restore "rental_project/rental_project.csproj"

COPY . .
WORKDIR "/src/rental_project"
RUN dotnet build "rental_project.csproj" -c Release -o /app/build

FROM build AS publish
WORKDIR "/src/rental_project"
RUN dotnet publish "rental_project.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "rental_project.dll"]