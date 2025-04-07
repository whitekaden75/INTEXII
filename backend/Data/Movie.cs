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

    // Genre/Category Flags (mapped to SQLite INTEGER columns)
    [Column("Action")] public bool? Action { get; set; }
    [Column("Adventure")] public bool? Adventure { get; set; }
    [Column("Anime Series International TV Shows")] public bool? AnimeSeries_InternationalTVShows { get; set; }
    [Column("British TV Shows Docuseries International TV Shows")] public bool? BritishTVShows_Docuseries_InternationalTVShows { get; set; }
    [Column("Children")] public bool? Children { get; set; }
    [Column("Comedies")] public bool? Comedies { get; set; }
    [Column("Comedies Dramas International Movies")] public bool? Comedies_Dramas_InternationalMovies { get; set; }
    [Column("Comedies International Movies")] public bool? Comedies_InternationalMovies { get; set; }
    [Column("Comedies Romantic Movies")] public bool? Comedies_RomanticMovies { get; set; }
    [Column("Crime TV Shows Docuseries")] public bool? CrimeTVShows_Docuseries { get; set; }
    [Column("Documentaries")] public bool? Documentaries { get; set; }
    [Column("Documentaries International Movies")] public bool? Documentaries_InternationalMovies { get; set; }
    [Column("Docuseries")] public bool? Docuseries { get; set; }
    [Column("Dramas")] public bool? Dramas { get; set; }
    [Column("Dramas International Movies")] public bool? Dramas_InternationalMovies { get; set; }
    [Column("Dramas Romantic Movies")] public bool? Dramas_RomanticMovies { get; set; }
    [Column("Family Movies")] public bool? FamilyMovies { get; set; }
    [Column("Fantasy")] public bool? Fantasy { get; set; }
    [Column("Horror Movies")] public bool? HorrorMovies { get; set; }
    [Column("International Movies Thrillers")] public bool? InternationalMovies_Thrillers { get; set; }
    [Column("International TV Shows Romantic TV Shows TV Dramas")] public bool? InternationalTVShows_RomanticTVShows_TVDramas { get; set; }
    [Column("Kids' TV")] public bool? KidsTV { get; set; }
    [Column("Language TV Shows")] public bool? LanguageTVShows { get; set; }
    [Column("Musicals")] public bool? Musicals { get; set; }
    [Column("Nature TV")] public bool? NatureTV { get; set; }
    [Column("Reality TV")] public bool? RealityTV { get; set; }
    [Column("Spirituality")] public bool? Spirituality { get; set; }
    [Column("TV Action")] public bool? TVAction { get; set; }
    [Column("TV Comedies")] public bool? TVComedies { get; set; }
    [Column("TV Dramas")] public bool? TVDramas { get; set; }
    [Column("Talk Shows TV Comedies")] public bool? TalkShows_TVComedies { get; set; }
    [Column("Thrillers")] public bool? Thrillers { get; set; }
}
