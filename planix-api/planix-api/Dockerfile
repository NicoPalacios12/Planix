FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY planix-api.csproj .
RUN dotnet restore planix-api.csproj

COPY . .
RUN dotnet publish planix-api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "planix-api.dll"]