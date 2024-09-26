class Article < ApplicationRecord
  searchkick text_middle: [ :title, :body ]
end
