class SearchController < ApplicationController
  def search
    @results = search_for_articles

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update(
          "js-articles",
          partial: "articles/articles",
          locals: { articles: @results }
        )
      end
    end
  end

  def suggestions
    @results = search_for_articles

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update(
          "js-search-suggestions",
          partial: "search/suggestions",
          locals: { results: @results }
        )
      end
    end
  end

  private

  def search_for_articles
    return Article.limit(25) if params[:query].blank?

    Article.search(params[:query], fields: [ :title, :body ], operator: :or, match: :text_middle, limit: 25)
  end
end
