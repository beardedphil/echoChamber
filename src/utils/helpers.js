export const sampleArticle = {
    logo_link: "//logo.clearbit.com/slate.com",
    image_link: "http://www.slate.com/content/dam/slate/articles/news_and_politics/politics/2017/08/170831_POL_Trump-BadPolls.jpg.CROP.promo-large.jpg",
    title: "The Evidence Has Never Been Clearer: White Resentment Defines the GOP",
    url: "http://www.slate.com/articles/news_and_politics/politics/2017/09/trump_s_support_comes_from_white_resentment.html"
}

export function isLoggedIn() {
	return true;
}

export function getSources() {
    let sourceLinks = [
        "//logo.clearbit.com/cnn.com",
        "//logo.clearbit.com/msnbc.com",
        "//logo.clearbit.com/latimes.com",
        "//logo.clearbit.com/washingtonpost.com",
        "//logo.clearbit.com/newyorktimes.com",
        "//logo.clearbit.com/wsj.com",
        "//logo.clearbit.com/breitbart.com",
        "//logo.clearbit.com/nbcnews.com",
        "//logo.clearbit.com/news.bbc.co.uk",
        "//logo.clearbit.com/foxnews.com",
        "//logo.clearbit.com/slate.com",
    ];

    return sourceLinks;
}

export function getArticles() {
    let articles = [];

    for (var i = 0; i < 20; i++) {
        articles.push(sampleArticle);
    }

    return articles;
}
