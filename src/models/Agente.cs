using System.ComponentModel.DataAnnotations;

namespace CarmonaSales.Models
{
    public class Agente : BaseModel
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [Phone]
        [StringLength(20)]
        public string Telefono { get; set; }

        [Required]
        [StringLength(50)]
        public string Estado { get; set; }

        // Relaciones
        public virtual ICollection<Cliente> Clientes { get; set; }
        public virtual ICollection<Credito> Creditos { get; set; }
    }
} 