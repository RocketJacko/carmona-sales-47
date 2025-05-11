using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarmonaSales.Data;
using CarmonaSales.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace CarmonaSales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AgentesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Agentes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Agente>>> GetAgentes()
        {
            return await _context.Agentes
                .Where(a => a.Activo)
                .ToListAsync();
        }

        // GET: api/Agentes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Agente>> GetAgente(int id)
        {
            var agente = await _context.Agentes
                .Include(a => a.Clientes)
                .Include(a => a.Creditos)
                .FirstOrDefaultAsync(a => a.Id == id && a.Activo);

            if (agente == null)
            {
                return NotFound();
            }

            return agente;
        }

        // POST: api/Agentes
        [HttpPost]
        public async Task<ActionResult<Agente>> CreateAgente(Agente agente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Agentes.Add(agente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAgente), new { id = agente.Id }, agente);
        }

        // PUT: api/Agentes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAgente(int id, Agente agente)
        {
            if (id != agente.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            agente.FechaModificacion = DateTime.Now;
            _context.Entry(agente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AgenteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Agentes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAgente(int id)
        {
            var agente = await _context.Agentes.FindAsync(id);
            if (agente == null)
            {
                return NotFound();
            }

            agente.Activo = false;
            agente.FechaModificacion = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AgenteExists(int id)
        {
            return _context.Agentes.Any(e => e.Id == id && e.Activo);
        }
    }
} 