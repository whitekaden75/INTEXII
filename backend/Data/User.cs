using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("userRecommendations")]
    public class UserRecommendation
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("show_id")]
        public string ShowId { get; set; } = string.Empty;

        [Column("recommendation_1")]
        public string? Recommendation1 { get; set; }

        [Column("recommendation_2")]
        public string? Recommendation2 { get; set; }

        [Column("recommendation_3")]
        public string? Recommendation3 { get; set; }

        [Column("recommendation_4")]
        public string? Recommendation4 { get; set; }

        [Column("recommendation_5")]
        public string? Recommendation5 { get; set; }

        [Column("recommendation_6")]
        public string? Recommendation6 { get; set; }

        [Column("recommendation_7")]
        public string? Recommendation7 { get; set; }

        [Column("recommendation_8")]
        public string? Recommendation8 { get; set; }

        [Column("recommendation_9")]
        public string? Recommendation9 { get; set; }

        [Column("recommendation_10")]
        public string? Recommendation10 { get; set; }
    }