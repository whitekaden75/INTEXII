
import { Movie } from '../contexts/MovieContext';

const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Lost in Translation',
    releaseDate: '2003-09-12',
    genres: ['Drama', 'Romance'],
    contentRating: 'R',
    userRating: 4.5,
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080',
    description: 'A faded movie star and a neglected young woman form an unlikely bond after crossing paths in Tokyo.',
    duration: '1h 42m',
    director: 'Sofia Coppola',
    cast: ['Bill Murray', 'Scarlett Johansson', 'Giovanni Ribisi'],
    featured: true
  },
  {
    id: '2',
    title: 'Amelie',
    releaseDate: '2001-04-25',
    genres: ['Comedy', 'Romance'],
    contentRating: 'R',
    userRating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=750',
    description: 'Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.',
    duration: '2h 2m',
    director: 'Jean-Pierre Jeunet',
    cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus'],
    featured: true
  },
  {
    id: '3',
    title: 'The Lighthouse',
    releaseDate: '2019-10-18',
    genres: ['Drama', 'Fantasy', 'Horror'],
    contentRating: 'R',
    userRating: 4.1,
    posterUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&h=750',
    description: 'Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s.',
    duration: '1h 49m',
    director: 'Robert Eggers',
    cast: ['Robert Pattinson', 'Willem Dafoe'],
    featured: false
  },
  {
    id: '4',
    title: 'Parasite',
    releaseDate: '2019-05-30',
    genres: ['Drama', 'Thriller'],
    contentRating: 'R',
    userRating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=750',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    duration: '2h 12m',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    featured: true
  },
  {
    id: '5',
    title: 'Oldboy',
    releaseDate: '2003-11-21',
    genres: ['Action', 'Drama', 'Mystery'],
    contentRating: 'R',
    userRating: 4.6,
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750',
    description: 'After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find that he must find his captor in five days.',
    duration: '2h',
    director: 'Park Chan-wook',
    cast: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung'],
    featured: false
  },
  {
    id: '6',
    title: 'In the Mood for Love',
    releaseDate: '2000-09-29',
    genres: ['Drama', 'Romance'],
    contentRating: 'PG',
    userRating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=750',
    description: 'Two neighbors form a strong bond after both suspect extramarital activities of their spouses. However, they agree to keep their bond platonic so as not to commit similar wrongs.',
    duration: '1h 38m',
    director: 'Wong Kar-wai',
    cast: ['Tony Leung Chiu-wai', 'Maggie Cheung'],
    featured: false
  },
  {
    id: '7',
    title: 'City of God',
    releaseDate: '2002-05-18',
    genres: ['Crime', 'Drama'],
    contentRating: 'R',
    userRating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&h=750',
    description: 'In the slums of Rio, two kids paths diverge as one struggles to become a photographer and the other a kingpin.',
    duration: '2h 10m',
    director: 'Fernando Meirelles',
    cast: ['Alexandre Rodrigues', 'Leandro Firmino', 'Matheus Nachtergaele'],
    featured: false
  },
  {
    id: '8',
    title: 'Pan\'s Labyrinth',
    releaseDate: '2006-10-11',
    genres: ['Drama', 'Fantasy', 'War'],
    contentRating: 'R',
    userRating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=750',
    description: 'In the Falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.',
    duration: '1h 58m',
    director: 'Guillermo del Toro',
    cast: ['Ivana Baquero', 'Ariadna Gil', 'Sergi López'],
    featured: false
  },
  {
    id: '9',
    title: 'Memories of Murder',
    releaseDate: '2003-05-02',
    genres: ['Crime', 'Drama', 'Mystery'],
    contentRating: 'R',
    userRating: 4.6,
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750',
    description: 'In a small Korean province in 1986, two detectives struggle with the case of multiple young women being found raped and murdered by an unknown culprit.',
    duration: '2h 11m',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Kim Sang-kyung', 'Kim Roi-ha'],
    featured: false
  },
  {
    id: '10',
    title: 'The Handmaiden',
    releaseDate: '2016-06-01',
    genres: ['Drama', 'Romance', 'Thriller'],
    contentRating: 'R',
    userRating: 4.5,
    posterUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=750',
    description: 'A woman is hired as a handmaiden to a Japanese heiress, but secretly she is involved in a plot to defraud her.',
    duration: '2h 25m',
    director: 'Park Chan-wook',
    cast: ['Kim Min-hee', 'Kim Tae-ri', 'Ha Jung-woo'],
    featured: false
  },
  {
    id: '11',
    title: 'Spirited Away',
    releaseDate: '2001-07-20',
    genres: ['Animation', 'Adventure', 'Family'],
    contentRating: 'PG',
    userRating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&h=750',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    duration: '2h 5m',
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    featured: false
  },
  {
    id: '12',
    title: 'Rashomon',
    releaseDate: '1950-08-26',
    genres: ['Crime', 'Drama', 'Mystery'],
    contentRating: 'NR',
    userRating: 4.5,
    posterUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=750',
    description: 'The rape of a bride and the murder of her samurai husband are recalled from the perspectives of a bandit, the bride, the samurai\'s ghost and a woodcutter.',
    duration: '1h 28m',
    director: 'Akira Kurosawa',
    cast: ['Toshiro Mifune', 'Machiko Kyō', 'Masayuki Mori'],
    featured: false
  }
];

export default mockMovies;
