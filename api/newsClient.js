const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

const TABLE_NAME = import.meta.env.VITE_SUPABASE_TABLE || 'news';
const STORAGE_KEY = 'sesi_news_local_articles';
const AUTH_SESSION_KEY = 'sesi_news_admin_session';

const getLocalArticles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalArticles = (articles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

const sortArticles = (articles) => {
  return [...articles].sort((a, b) => {
    const aDate = a.published_date || a.created_at || '';
    const bDate = b.published_date || b.created_at || '';
    return new Date(bDate) - new Date(aDate);
  });
};

const toAppArticle = (article) => ({
  ...article,
  image_url: article.image_url || article.image || '',
  created_date: article.created_at,
});

const toDatabaseArticle = (article) => ({
  title: article.title,
  summary: article.summary,
  content: article.content,
  category: article.category,
  image: article.image_url || article.image || null,
  published_date: article.published_date || new Date().toISOString().slice(0, 10),
});

const getStoredSession = () => {
  try {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

const getAccessToken = () => getStoredSession()?.access_token;

const supabaseRequest = async (path, options = {}) => {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase não configurado.');
  }

  const token = options.authenticated ? getAccessToken() : null;
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${token || supabaseKey}`,
    ...options.headers,
  };

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const auth = {
  async signIn(email, password) {
    if (!hasSupabaseConfig) return null;

    const data = await supabaseRequest('/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem(AUTH_SESSION_KEY);
  },

  hasSession() {
    const session = getStoredSession();
    if (!session?.access_token) return false;
    if (!session.expires_at) return true;
    return Date.now() < session.expires_at * 1000;
  },
};

export const articlesApi = {
  async list() {
    if (!hasSupabaseConfig) return sortArticles(getLocalArticles()).map(toAppArticle);

    const params = new URLSearchParams({
      select: '*',
      order: 'published_date.desc,created_at.desc',
    });

    const data = await supabaseRequest(`/rest/v1/${TABLE_NAME}?${params.toString()}`);
    return (data || []).map(toAppArticle);
  },

  async findById(id) {
    if (!hasSupabaseConfig) {
      return getLocalArticles().map(toAppArticle).find((article) => String(article.id) === String(id));
    }

    const params = new URLSearchParams({ select: '*', id: `eq.${id}` });
    const data = await supabaseRequest(`/rest/v1/${TABLE_NAME}?${params.toString()}`);
    return data?.[0] ? toAppArticle(data[0]) : null;
  },

  async create(data) {
    if (!hasSupabaseConfig) {
      const now = new Date().toISOString();
      const articles = getLocalArticles();
      const article = toAppArticle({
        id: crypto.randomUUID(),
        created_at: now,
        ...data,
      });
      articles.push(article);
      saveLocalArticles(articles);
      return article;
    }

    const result = await supabaseRequest(`/rest/v1/${TABLE_NAME}`, {
      method: 'POST',
      authenticated: true,
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(toDatabaseArticle(data)),
    });

    return toAppArticle(result[0]);
  },

  async update(id, data) {
    if (!hasSupabaseConfig) {
      const articles = getLocalArticles();
      const index = articles.findIndex((article) => String(article.id) === String(id));
      if (index === -1) return null;
      articles[index] = toAppArticle({ ...articles[index], ...data });
      saveLocalArticles(articles);
      return articles[index];
    }

    const result = await supabaseRequest(`/rest/v1/${TABLE_NAME}?id=eq.${id}`, {
      method: 'PATCH',
      authenticated: true,
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(toDatabaseArticle(data)),
    });

    return toAppArticle(result[0]);
  },

  async delete(id) {
    if (!hasSupabaseConfig) {
      saveLocalArticles(getLocalArticles().filter((article) => String(article.id) !== String(id)));
      return true;
    }

    await supabaseRequest(`/rest/v1/${TABLE_NAME}?id=eq.${id}`, {
      method: 'DELETE',
      authenticated: true,
    });
    return true;
  },
};

export const uploadImageLocally = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const isSupabaseConfigured = hasSupabaseConfig;
