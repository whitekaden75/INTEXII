using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    [Table("movies_ratings")]
    public class UserRating
    {
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("show_id")]
        public string ShowId { get; set; } = string.Empty;

        [Column("rating")]
        public int Rating { get; set; }
    }
}