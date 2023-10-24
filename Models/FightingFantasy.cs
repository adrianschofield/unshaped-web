using System.ComponentModel.DataAnnotations;

namespace unshaped_web.Models
{
    public class FightingFantasy
    {
        [Range(1, 100,
        ErrorMessage = "Hero's skill is invalid (1-100).")]
        public int HeroSkill { get; set; }
        [Range(0, 100,
        ErrorMessage = "Hero's stamina is invalid (0-100).")]
        public int HeroStamina { get; set; }
        [Range(1, 100,
        ErrorMessage = "Hero's luck is invalid (1-100).")]
        public int HeroLuck { get; set; }
        [Range(1, 100,
        ErrorMessage = "Monster's skill is invalid (1-100).")]
        public int MonsterSkill { get; set; }
        [Range(0, 100,
        ErrorMessage = "Monster's stamina is invalid (0-100).")]
        public int MonsterStamina { get; set; }
        

    }
}