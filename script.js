class SearchLayout{
    constructor(){
        this.body = document.querySelector('.body');
        this.header = this.createElement('header', 'header');
        this.main = this.createElement('main');
        this.body.append(this.header,this.main)

        this.header.append(this.createElement(
            'p', 
            'header_text', 
            'Git Repositories Search'));
        this.main.append(this.createElement(
            'section',
            'search'
        ));
        this.main_section = document.querySelector('.search');
        this.main_section.append(this.createElement(
            'div',
            'search__container'
        ));
        this.main_section_div = document.querySelector('.search__container')
        this.main_section_div.append(this.createElement(
            'div',
            'search_box'
        ));
        this.search_box = document.querySelector('.search_box');
        this.search_box.append(this.createElement(
            'input',
            'search_input'
        ));
        this.search_box.append(this.createElement(
            'ul',
            'found_repositories'
        ))
        this.main_section_div.append(this.createElement(
            'ul',
            'repositories_list'
        ));
        
    }
    createElement(elemTag, elemClass,text){
        const elem = document.createElement(elemTag);
        if(elemClass){
            elem.classList.add(elemClass);
        };
        if(text){
            elem.textContent = text;
        }
        return elem
    }

}

let app = new SearchLayout();

let searchInput = document.querySelector('.search_input');
let found_repositories = document.querySelector('.found_repositories');
let repositories_list = document.querySelector('.repositories_list');

searchInput.addEventListener('keyup', debounce(userSearch.bind(this), 500))
let reposArr = [];

function debounce(fn, debounceTime){
    let timeout;
    return function(...arguments) {
        const callFunc = () => {
        fn.apply(this,arguments)
    }
    clearTimeout(timeout);
    timeout = setTimeout(callFunc, debounceTime)
  }
}

function removeChildElements(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
}
function removeElement(elem) {
    elem.lastElementChild.classList.add('img-del-onclick')
    setTimeout(function (){
        elem.remove()
    },0);
}
async function userSearch(){
    removeChildElements(found_repositories);
    return await fetch(
      `https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5`
    ).then(async (result) => {
      if (result.ok) {
        const repositoriesJSON = result.json();
        const repositories = await repositoriesJSON;
        repositories.items.forEach((repository) => {
            reposArr.push(repository);
            found_repositories.insertAdjacentHTML(
            "beforeend",
            `<li class="repository">${repository.name}</li>`
          );
        });
      } else {
        throw new Error();
      }
    });
}

function addOnclick(parentElem, childElem, func) {
    parentElem.onclick = function findRepository(event) {
      let elem = event.target.closest(`${childElem}`);
      if (!elem) return;
      if (!parentElem.contains(elem)) return;
      if( elem.lastElementChild && elem.lastElementChild.tagName === 'IMG' && event.target === elem.lastElementChild){ 
          func(elem);    
      } 
      if(!elem.lastElementChild){
          func(elem);
      }
    };
}

addOnclick(found_repositories, "li", repositoryAddition);

function repositoryAddition(repo) {
    let repository = reposArr.filter((repository) => {
      return repository.name === repo.textContent;
    });
    repository = repository[0];
    repositories_list.insertAdjacentHTML(
      "beforeend",
      `<li class="added_repository" >
                      <strong>Name</strong>: ${repository.name}<br> 
                      <strong>Owner</strong>: ${repository.owner.login}<br>
                      <strong>Stars</strong>: ${repository.stargazers_count} 
                      <img src="xmark-large-svgrepo-com.svg" alt="delete" width="50" height="50" class="delete_img">
          </li>`
    );
    searchInput.value = '';
    removeChildElements(found_repositories);
  
    addOnclick(repositories_list, "li", removeElement);
}


