using Common.Extensions;

namespace Thorsight;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication(Configuration, options =>
        {
            options.UseServiceLevels = false;
            options.ValidateServiceLevelsOnInitialize = true;
            options.IgnoreIServiceWithoutLifetime = false;
        },
        Program.Assembly);

        services.AddControllers();

        services.AddSingleton<HttpClient>();
        services.AddMemoryCache();
        services.AddResponseCaching();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void ConfigurePipeline(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(policy =>
        {
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowAnyOrigin();
        });

        app.UseStaticFiles();

        //app.UseResponseCaching();        

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();
    }

    public void ConfigureRoutes(IEndpointRouteBuilder routes)
    {
        routes.MapControllers();
        routes.MapFallbackToFile("index.html");
    }
}