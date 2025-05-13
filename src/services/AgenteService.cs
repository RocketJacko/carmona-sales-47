using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CarmonaSales.Data;
using CarmonaSales.Models;

namespace CarmonaSales.Services
{
    public interface IAgenteService
    {
        Task<IEnumerable<Agente>> GetAllAsync();
        Task<Agente> GetByIdAsync(int id);
        Task<Agente> CreateAsync(Agente agente);
        Task<Agente> UpdateAsync(int id, Agente agente);
        Task<bool> DeleteAsync(int id);
        Task<bool> ValidateEmailAsync(string email);
    }

    public class AgenteService : IAgenteService
    {
        private readonly ApplicationDbContext _context;

        public AgenteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Agente>> GetAllAsync()
        {
            return await _context.Agentes
                .Where(a => a.Activo)
                .ToListAsync();
        }

        public async Task<Agente> GetByIdAsync(int id)
        {
            return await _context.Agentes
                .Include(a => a.Clientes)
                .Include(a => a.Creditos)
                .FirstOrDefaultAsync(a => a.Id == id && a.Activo);
        }

        public async Task<Agente> CreateAsync(Agente agente)
        {
            if (!await ValidateEmailAsync(agente.Email))
            {
                throw new ArgumentException("El email proporcionado no es válido");
            }

            _context.Agentes.Add(agente);
            await _context.SaveChangesAsync();
            return agente;
        }

        public async Task<Agente> UpdateAsync(int id, Agente agente)
        {
            if (id != agente.Id)
            {
                throw new ArgumentException("El ID proporcionado no coincide");
            }

            if (!await ValidateEmailAsync(agente.Email))
            {
                throw new ArgumentException("El email proporcionado no es válido");
            }

            var existingAgente = await _context.Agentes.FindAsync(id);
            if (existingAgente == null)
            {
                throw new KeyNotFoundException("Agente no encontrado");
            }

            agente.FechaModificacion = DateTime.Now;
            _context.Entry(existingAgente).CurrentValues.SetValues(agente);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await AgenteExistsAsync(id))
                {
                    throw new KeyNotFoundException("Agente no encontrado");
                }
                throw;
            }

            return agente;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var agente = await _context.Agentes.FindAsync(id);
            if (agente == null)
            {
                return false;
            }

            agente.Activo = false;
            agente.FechaModificacion = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ValidateEmailAsync(string email)
        {
            // Implementar validación de email
            return !string.IsNullOrEmpty(email) && email.Contains("@");
        }

        private async Task<bool> AgenteExistsAsync(int id)
        {
            return await _context.Agentes.AnyAsync(e => e.Id == id && e.Activo);
        }
    }
} 