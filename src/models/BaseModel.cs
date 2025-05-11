using System;
using System.ComponentModel.DataAnnotations;

namespace CarmonaSales.Models
{
    public abstract class BaseModel
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        
        public DateTime? FechaModificacion { get; set; }
        
        [Required]
        public bool Activo { get; set; } = true;
    }
} 