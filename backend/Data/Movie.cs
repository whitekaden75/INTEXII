using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("movies_titles")]
public class Movie
{
    [Key]
    [Column("show_id")]
    public string ShowId { get; set; }

    [Column("type")]
    public string? Type { get; set; }

    [Column("title")]
    public string? Title { get; set; }

    [Column("director")]
    public string? Director { get; set; }

    [Column("cast")]
    public string? Cast { get; set; }

    [Column("country")]
    public string? Country { get; set; }

    [Column("release_year")]
    public int? ReleaseYear { get; set; }

    [Column("rating")]
    public string? Rating { get; set; }

    [Column("duration")]
    public string? Duration { get; set; }

    [Column("description")]
    public string? Description { get; set; }

   [Column("genre")]
       public string? Genre { get; set; }
}
