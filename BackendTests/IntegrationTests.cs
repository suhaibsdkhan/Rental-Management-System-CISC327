using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using rental_project.Services;

namespace Tests;

public class IntegrationTests : IntegrationTestBase {
    public IntegrationTests(WebApplicationFactory<Program> factory) : base(factory) {
    }

    [Fact]
    public async Task Create_Lease_Api_Test() {
        // Arrange
        var tenants = new List<TenantDTO>
        {
            new TenantDTO("John", "Doe"),
            new TenantDTO("Jane", "Smith")
        };

        var payload = new CreateLeaseDTO(
            "123 Elm Street",
            new DateTime(2024, 1, 1),
            new DateTime(2025, 1, 1),
            1500.00m,
            tenants
        );

        // Act
        var result = await Client.PostAsJsonAsync("/api/lease", payload);

        // Assert
        Assert.Equal(HttpStatusCode.Created, result.StatusCode);
    }

    [Fact]
    public async Task Get_Lease_By_Id_Api_Test() {
        // Arrange
        var tenants = new List<TenantDTO>
        {
            new TenantDTO("Spongebob", "Squarepants"),
            new TenantDTO("Patrick", "Star")
        };

        var payload = new CreateLeaseDTO(
            "456 Test Avenue",
            new DateTime(2024, 2, 1),
            new DateTime(2025, 2, 1),
            2000.00m,
            tenants
        );

        // Create the lease 
        var createResponse = await Client.PostAsJsonAsync("/api/lease", payload);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var leaseId = await createResponse.Content.ReadAsStringAsync();

        // Act
        var getResponse = await Client.GetAsync($"/api/lease/{leaseId.Trim('"')}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOk()
    {
        var loginData = new
        {
            email = TestUserEmail,
            password = TestUserPassword
        };
        
        // Act
        var response = await Client.PostAsJsonAsync("/login", loginData);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseData = await response.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(responseData?.AccessToken);
    }
}

public record LoginResponse(
    string TokenType,
    string AccessToken,
    int ExpiresIn,
    string RefreshToken);