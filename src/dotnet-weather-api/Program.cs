using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Okta.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddCors(options =>
{
    options
        .AddPolicy(
            "AllowAll",
            builder => builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader()
        );
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = OktaDefaults.ApiAuthenticationScheme;
    options.DefaultChallengeScheme = OktaDefaults.ApiAuthenticationScheme;
    options.DefaultSignInScheme = OktaDefaults.ApiAuthenticationScheme;
}).AddOktaWebApi(new OktaWebApiOptions
{
    OktaDomain = builder.Configuration["Okta:OktaDomain"],
    Audience = builder.Configuration["Okta:Audience"],
    AuthorizationServerId = builder.Configuration["Okta:AuthorizationServerId"]
});

builder.Services.AddAuthorization(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.DefaultPolicy = policy;
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();
app.UseAuthorization();
app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", [Authorize] () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.MapGet("/whoami", [Authorize] (HttpContext httpContext) =>
{
    var principal = httpContext.User.Identity as ClaimsIdentity;

    return principal!.Claims.GroupBy(claim => claim.Type)
    .ToDictionary(claim => claim.Key, claim => claim.First().Value);
});

app.MapGet("/hello", [AllowAnonymous] () => "You are anonymous");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
