import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { ifDefined } from "Lit/directives/if-defined.js";
//Simple icon stuff
import '@haxtheweb/hax-iconset/hax-iconset.js';
import '@haxtheweb/simple-icon/simple-icon.js';
export class Project1 extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "search-hax";
  }

  constructor() {
    super();
    this.name = "";
    this.alt = "";
    this.description = "";
    this.logo = "";
    this.theme = "";
    this.created = "";
    this.lastUpdated = "";
    this.hexCode = "";
    this.icon = "";
    this.items = [];
    this.baseUrl = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      name: { type: String },
      alt: { type: String },
      description: { type: String },
      logo: { type: String },
      theme: { type: String },
      created: { type: String },
      lastUpdated: { type: String, attribute: 'updated' },
      hexCode: { type: String },
      icon: { type: String },
      items: { type: Array },
      baseUrl: { type: String, attribute: 'base-url' }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
        margin: var(--ddd-spacing-4);
        padding: var(--ddd-spacing-4);
        border-radius: var(--ddd-radius-md); 
      }
      
      .input-container {
        display: flex;
        justify-content: center;
        margin-bottom: var(--ddd-spacing-5);
      }
      
      input {
        padding: var(--ddd-spacing-2);
        font-size: 16px;
        width: 500px;
        margin-right: var(--ddd-spacing-2);
        border-radius: var(--ddd-radius-sm);
        background-color: var(--ddd-theme-default-nittanyNavy);
      }
      
      button {
        padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
        font-size: 16px;
        cursor: pointer;
        background-color: #007BFF; 
        color: white; 
        border-radius: var(--ddd-radius-sm);
      }
      
      button:hover {
        background-color: #0056b3; 
      }
      
      .overview {
        text-align: center;
        margin-bottom: var(--ddd-spacing-10);
        background-color: var(--ddd-theme-default-limestoneGray); 
        padding: var(--ddd-spacing-5);
        border-radius: 8px;
        box-shadow: var(--ddd-shadow-sm);
        color: black;
      }
      
      .overview img {
        max-width: 300px;
      }
      
      .cards-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr); /*This forces the auto-fit to not go past 4 cards in a row*/
        gap: 20px; 
        width: 100%; 
        box-sizing: border-box; 
      }

      .card {
        background-color: var(--ddd-theme-default-white);
        border: 1px solid #e1e1e1;
        padding: var(--ddd-spacing-5);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: left;
        border-radius: var(--ddd-radius-sm);
      }

      /*These auto-fit the amount of cards per the size of the screen.*/
      @media (max-width: 1024px) {
        .cards-container {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Automatically adjust */
        }
      }

      @media (max-width: 768px) {
        .cards-container {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Automatically adjust */
        }
      }

      @media (max-width: 480px) {
        .cards-container {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Automatically adjust */
        }
      }

      .card h3 {
        font-size: 18px;
        margin-bottom: var(--ddd-spacing-3);
        color: #333; 
      }
      
      .card p {
        font-size: 14px;
        color: #666;
      }
      
      .card a {
        font-size: 14px;
        color: #007BFF; 
        text-decoration: underline;
        display: block;
        margin-top: var(--ddd-spacing-3);
      }
      
      .card a:hover {
        color: #0056b3; 
      }
      
      .card img{
        width: 275px;
        height: auto;
      }
      .icon {
        display: inline-block;
        width: 20px; 
        height: 20px; 
        margin-right: 5px; 
      }
    `];
  }

  // Handle input changes and trigger JSON fetch
  inputChanged() {
    let siteUrl = this.shadowRoot.getElementById('input').value.trim(); // Gets value from user input

    // Ensure URL starts with 'https://', if not it adds it on
    if (!siteUrl.startsWith('https://')) {
      siteUrl = 'https://' + siteUrl;
    }

    // Ensure URL ends with '/site.json', if not it adds it on
    if (!siteUrl.endsWith('/site.json')) {
      siteUrl = siteUrl + '/site.json';
    }

    //If user inputs URL ending with '/' then remove it so then slashes are not doubled
    if (siteUrl.endsWith('/')) {
      siteUrl = siteUrl.slice(0, -1);
    }

    this.baseUrl = siteUrl.replace('/site.json', '');
    if (siteUrl) {
      this.fetchSiteData(siteUrl);
    } 
    
    else {
      alert("Please enter a valid URL."); // Alert if input is empty
    }
  }

  // This method triggers inputChanged when the user clicks enter on the keyboard
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.inputChanged();
    }
  }

  getImg(item){
    let images = item.metadata.images;
    if(images){
      if(images.length > 0){
        return(this.baseUrl+images[0]);
      }
      else{
        return '';
      }
    }
  }

  // Fetching data from /site.json file 
  async fetchSiteData(siteUrl) {
      const response = await fetch(siteUrl);
      const data = await response.json();

      // Ensure the structure is as expected
      if (data) {
        
        // Accessing metadata properties and setting default values if none are found in /site.json
        this.name = data.title || "Default Site Name";
        this.description = data.description || "Default description.";
        this.logo = data.metadata.site.logo || "project-1/defaultLogo.png";
        this.theme = data.metadata.theme.element || "Default theme";
        this.created = new Date(parseInt(data.metadata.site.created)*1000).toLocaleDateString() || "Not specified";
        this.lastUpdated = new Date(parseInt(data.metadata.site.updated)*1000).toLocaleDateString() || "Not specified";
        this.hexCode = data.metadata.theme.variables.hexCode || "#000000"; 
        this.icon = data.metadata.theme.variables.icon;
        this.items = data.items || [];
      }
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="input-container">

      <!--If user clicks enter on keyboard then use analyze button-->
      <input id="input" @keypress="${this.handleKeyPress}" placeholder="Enter a HAX website" /> 
      
      <!-- When Analyze is clicked, search for new metadata relating to URL -->
      <button @click="${this.inputChanged}">Analyze</button> 

    </div>

    <!--This is for the top section Overview -->
    <div class="overview">

      <h1>Overview</h1>

      <img ?hidden="${this.logo === ''}" src = "${this.baseUrl}/${this.logo}"/>
      <h2>
        <span class="icon" ?hidden="${this.icon === ''}" >
          <simple-icon icon="${this.icon}"></simple-icon>
        </span> 
        ${this.name}
      </h2>
      
      <p><strong>Description: </strong>${this.description}</p>

      <p><strong>Theme: </strong> ${this.theme}</p>
      <p><strong>Created: </strong> ${this.created}</p>
      <p><strong>Last Updated: </strong> ${this.lastUpdated}</p>
      <p><strong>Hex Code: </strong> ${this.hexCode}</p>
      
    </div>


    <!--This is for the indivual cards-->
    <div class="cards-container">
      ${this.items.map(item => html`

        <div class="card">

          <img src="${ifDefined(this.getImg(item))}">
          <h3>${item.title}</h3>
          <p><strong>Description:</strong>${item.description}</p>

          <p><strong>Last updated:</strong> ${new Date(parseInt(item.metadata.updated)*1000).toLocaleDateString()}</p>
          <p><strong>Slug:</strong> ${item.slug}</p>

          <a href="${this.baseUrl}/${item.slug}" target="_blank">Open Content</a>
          <a href="${this.baseUrl}/${item.location}" target="_blank">Open Source</a>
        </div>
      `)}
    </div>
    `;
  }
}

globalThis.customElements.define(Project1.tag, Project1);