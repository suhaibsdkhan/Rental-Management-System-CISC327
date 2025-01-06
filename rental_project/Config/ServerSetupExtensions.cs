using rental_project.Services;

namespace rental_project.Config; 

public static class ServerSetupExtensions {
    public static IHostApplicationBuilder AddServices(this IHostApplicationBuilder builder) {
        builder.Services.AddScoped<ILeaseService, LeaseService>();
        builder.Services.AddScoped<IPaymentService, PaymentService>();
        builder.Services.AddScoped<ITestDataService, TestDataService>();

        return builder;
    }
}