public void ConfigureServices(IServiceCollection services)
{
    // ... (other services)

    services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
    });

    services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

    // ... (other configuration)
}

