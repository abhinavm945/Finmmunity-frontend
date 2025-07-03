export interface Post {
  _id: string;
  userId: string;
  username: string;
  profilePicture?: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  isBookmarked: boolean;
}

export interface Blog {
  _id: string;
  userId: string;
  username: string;
  profilePicture?: string;
  title: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  isBookmarked: boolean;
}

export interface Comment {
  _id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
  posts: Post[];
  blogs: Blog[];
  bookmarks: Array<{ type: 'post' | 'blog'; id: string }>;
}

export const demoUsers: User[] = [
  {
    _id: 'user1',
    username: 'MarketAnalyst',
    profilePicture: '/images/default-avatar.png',
    bio: 'Sharing insights on stocks and crypto.',
    followers: ['user2', 'user3'],
    following: ['user2'],
    posts: [],
    blogs: [],
    bookmarks: [{ type: 'post', id: 'post2' }, { type: 'blog', id: 'blog1' }],
  },
  {
    _id: 'user2',
    username: 'CryptoGuru',
    profilePicture: '/images/default-avatar.png',
    bio: 'Crypto enthusiast and trader.',
    followers: ['user1'],
    following: ['user1', 'user3'],
    posts: [],
    blogs: [],
    bookmarks: [],
  },
  {
    _id: 'user3',
    username: 'TraderJoe',
    profilePicture: '/images/default-avatar.png',
    bio: 'Day trader and market watcher.',
    followers: ['user1'],
    following: ['user2'],
    posts: [],
    blogs: [],
    bookmarks: [],
  },
];

export const demoPosts: Post[] = [
  {
    _id: 'post1',
    userId: 'user1',
    username: 'MarketAnalyst',
    profilePicture: '/images/default-avatar.png',
    content: 'Tech stocks are poised for a Q4 rally based on historical trends.',
    image: '/images/placeholder-post.jpg',
    likes: ['user2'],
    comments: [
      {
        _id: 'comment1',
        userId: 'user2',
        username: 'CryptoGuru',
        content: 'Great analysis! Bullish on AAPL.',
        createdAt: '2025-05-22T10:00:00Z',
      },
    ],
    createdAt: '2025-05-22T09:00:00Z',
    isBookmarked: false,
  },
  {
    _id: 'post2',
    userId: 'user2',
    username: 'CryptoGuru',
    profilePicture: '/images/default-avatar.png',
    content: 'Bitcoin ETF approval could drive new investments.',
    image: '/images/placeholder-post.jpg',
    likes: ['user1', 'user3'],
    comments: [],
    createdAt: '2025-05-22T08:00:00Z',
    isBookmarked: false,
  },
];

export const demoBlogs: Blog[] = [
  {
    _id: 'blog1',
    userId: 'user1',
    username: 'MarketAnalyst',
    profilePicture: '/images/default-avatar.png',
    title: '2025 Market Outlook',
    content: 'Detailed analysis of stock market trends for 2025...',
    image: '/images/placeholder-post.jpg',
    likes: ['user2'],
    comments: [
      {
        _id: 'comment2',
        userId: 'user3',
        username: 'TraderJoe',
        content: 'Insightful read, thanks for sharing!',
        createdAt: '2025-05-22T11:00:00Z',
      },
    ],
    createdAt: '2025-05-22T07:00:00Z',
    isBookmarked: false,
  },
  {
    _id: 'blog2',
    userId: 'user2',
    username: 'CryptoGuru',
    profilePicture: '/images/default-avatar.png',
    title: 'Crypto Trends to Watch',
    content: 'Exploring the future of cryptocurrencies in 2025...',
    image: '/images/placeholder-post.jpg',
    likes: [],
    comments: [],
    createdAt: '2025-05-22T06:00:00Z',
    isBookmarked: false,
  },
];

// Initialize user posts and blogs
demoUsers[0].posts = demoPosts.filter((post) => post.userId === 'user1');
demoUsers[0].blogs = demoBlogs.filter((blog) => blog.userId === 'user1');
demoUsers[1].posts = demoPosts.filter((post) => post.userId === 'user2');
demoUsers[1].blogs = demoBlogs.filter((blog) => blog.userId === 'user2');