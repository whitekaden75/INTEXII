using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite("Data Source=movies.db"));

builder.Services.AddDbContext<MovieRecommendationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieRecommendationConnection")));

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("UserConnection")));


builder.Services.AddCors (options => 
    options.AddPolicy("AllowReactAppBlah",
        policy => {
            policy.WithOrigins("http://localhost:4005", // Your frontend port
                             "http://localhost:5173",   // Alternative Vite default port
                             "http://127.0.0.1:4005",  // Also allow localhost as IP
                            "http://127.0.0.1:5173",
                            "https://lively-pond-02080fc1e.6.azurestaticapps.net")
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactAppBlah");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
