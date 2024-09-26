import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="search"
export default class extends Controller {

  // This is a feature of Stimulus. Now, we can use these functions:
  // this.inputTarget
  // this.suggestionsTarget
  static targets = ["input", "suggestions"]

  connect() {
    console.log("Connected.")

    document.addEventListener("click", (event) => {
      if (!this.element.contains(event.target)) {
        this.hideSuggestions()
      }
    })
  }

  suggestions() {
    const query = this.inputTarget.value
    const url = this.element.dataset.suggestionsUrl

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.requestSuggestions(query, url)
    }, 300)
  }

  requestSuggestions(query, url) {
    if (query.length === 0) {
      this.hideSuggestions()
      return
    }

    this.showSuggestions()

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
      },
      body: JSON.stringify({ query: query })
    }).then(response => {
      response.text().then((html) => {
        document.body.insertAdjacentHTML("beforeend", html)
      })
    })
  }

  childClicked(event) {
    this.childWasClicked = this.element.contains(event.target)
  }

  hideSuggestions() {
    this.suggestionsTarget.classList.add("hidden")
  }

  showSuggestions() {
    if (!this.childWasClicked) {
      this.suggestionsTarget.classList.remove("hidden")
    }

    this.childWasClicked = false
  }
}
