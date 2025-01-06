using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using rental_project.Models;
using rental_project.Services;

namespace rental_project.Controllers;

public static class Routes {
    public static void ConfigureRoutes(IEndpointRouteBuilder app) {
        ConfigureInitialRoutes(app);
    }

    private static void ConfigureInitialRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/", () => Results.Redirect("/login"));

        app.MapGet("/generate-test-data",
            async (HttpContext httpContext, UserManager<User> userManager,
                ITestDataService testDataService) => {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.NotFound("User is not signed in");
            }

            testDataService.GenerateTestData(user.Id);
            return Results.Ok("Test data generated");
        });

        app.MapGet("/api/lease/{id}", (string id, ILeaseService leaseService) => {
            LeaseAgreement? la = leaseService.GetLeaseById(id);
            if (la is null) {
                return Results.NotFound();
            }

            return Results.Json(la);
        });

        app.MapGet("/api/leases", async (HttpContext httpContext,
            UserManager<User> userManager, ILeaseService leaseService) => {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.NotFound("User is not signed in");
            }

            List<LeaseAgreement> las = leaseService.GetAllLandlordsLeases(user.Id);

            return Results.Json(las);
        });

        app.MapPost("/api/lease",async ([FromBody] CreateLeaseDTO request, ILeaseService leaseService,
            HttpContext httpContext, UserManager<User> userManager) => {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.NotFound("User is not signed in");
            }

            var la = leaseService.CreateLease(request, user.Id);
            return Results.Created($"/api/lease/{la.Id}", la.Id);
        });

        app.MapDelete("/api/lease/{id}",(string id, ILeaseService leaseService) => {
            leaseService.DeleteLease(id);
            return Results.NoContent();
        });

        app.MapGet("/api/rent-payment/{id}", (string id, IPaymentService paymentService) => {
            RentPayment? rp = paymentService.GetRentPaymentById(id);
            if (rp is null) {
                return Results.NotFound();
            }

            return Results.Json(rp);
        });
    }
}