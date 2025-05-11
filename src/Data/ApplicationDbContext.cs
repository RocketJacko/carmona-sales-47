using Microsoft.EntityFrameworkCore;
using CarmonaSales.Models;

namespace CarmonaSales.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Agente> Agentes { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Credito> Creditos { get; set; }
        public DbSet<Contacto> Contactos { get; set; }
        public DbSet<Agendamiento> Agendamientos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Agente
            modelBuilder.Entity<Agente>()
                .HasMany(a => a.Clientes)
                .WithOne(c => c.Agente)
                .HasForeignKey(c => c.AgenteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Agente>()
                .HasMany(a => a.Creditos)
                .WithOne(c => c.Agente)
                .HasForeignKey(c => c.AgenteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración de Cliente
            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Contactos)
                .WithOne(co => co.Cliente)
                .HasForeignKey(co => co.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Agendamientos)
                .WithOne(a => a.Cliente)
                .HasForeignKey(a => a.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de Credito
            modelBuilder.Entity<Credito>()
                .HasOne(c => c.Cliente)
                .WithMany(cl => cl.Creditos)
                .HasForeignKey(c => c.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 