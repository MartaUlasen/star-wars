(function() {
	'use strict';
	var root = document.getElementsByClassName('js-root')[0];
	var main = document.getElementsByTagName('main')[0];
	var results;
	var jqxhr = undefined;
	var characters;
	
	page('/', homePage);
	page('/movies', filmsPage);
	page('/movies/:id', filmPage);
	page('/characters/', charactersPage);
	page('*', notFoundPage);
	page();
	
	function homePage() {
		if (jqxhr !== undefined) {
			jqxhr.abort();
		}
		clearContainer();
		addSpinner();
		removeSorter();
		jqxhr = jQuery.getJSON('https://swapi.co/api/films/')
		.done(function(response) {
			removeSpinner();
			results = response.results;
			results.sort(compareReleaseDate);
			//renderSlider(results);
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
	}
	
	function renderSlider(films) {
		var template = document.querySelector('.js-film-slider-template');
		
		var clone = document.importNode(template.content, true);
		var slides = clone.querySelector('.js-slides');
		
		films.forEach(function renderSlides(film, i) {
			var img = document.createElement('img');
			img.className = 'd-block w-100';
			img.src = renderSlide();
			var item = document.createElement('div');
			item.className = 'carousel-item';
			item.appendChild(img);
			slides.appendChild(item);
			
		});
		
		root.appendChild(clone);	
	}
	
	function renderSlide() {
		jqxhr = jQuery.getJSON('https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=A New Hope')
		.done(function(response) {
			results = response.results;
			getPosterSrc(results[0].poster_path);
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
		
	}
	
	function getPosterSrc(path) {
		return 'https://image.tmdb.org/t/p/w500/' + path;
	}
	
	function filmsPage() {
		if (jqxhr !== undefined) {
			jqxhr.abort();
		}
		clearContainer();
		addSpinner();
		addSorter();
		console.log('I am on the FILMS page');
		jqxhr = jQuery.getJSON('https://swapi.co/api/films/')
		.done(function(response) {
			removeSpinner();
			results = response.results;
			results.sort(compareReleaseDate);
			renderFilms(results);
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
		
		
		var dateSorter = document.getElementsByClassName('js-sorter--date')[0];
		var episodeSorter = document.getElementsByClassName('js-sorter--episode')[0];
		
		dateSorter.addEventListener('click', function() {
			clearContainer();
			addSpinner();
			removeSpinner();
			results.sort(compareReleaseDate);
			renderFilms(results);
		});
		
		episodeSorter.addEventListener('click', function() {
			clearContainer();
			addSpinner();
			removeSpinner();
			results.sort(compareNumberOfEpisode);
			renderFilms(results);
		});
	}
	
	function compareReleaseDate(film1, film2) {
		var date1 = new Date(film1.release_date);
		var date2 = new Date(film2.release_date);
		
		return date1 - date2;
	}

	function compareNumberOfEpisode(film1, film2) {
		return film1.episode_id - film2.episode_id;
	}

	function sortByNumber() {
		
	}
	
	function renderFilms(films) {
		var template = document.getElementsByClassName('js-film-card-template')[0];
		var row = document.createElement('div');
		row.className = "row";
		films.forEach(function createFilmCard(film, i) {
			
			var clone = document.importNode(template.content, true);
			var numberFilm = getHrefId(film.url);
			
			clone.querySelector('.js-url').href = "/movies/" + numberFilm;
			clone.querySelector('.js-url').setAttribute('data-url', film.url);
			clone.querySelector('.js-title').textContent = film.title;
			clone.querySelector('.js-episode').textContent = "Episode: " + film.episode_id;
			clone.querySelector('.js-director').textContent = "Director: " + film.director;
			clone.querySelector('.js-release-date').textContent = film.release_date;
					
			var colSm4 = document.createElement('div');
			colSm4.className = "col-sm-4 mb-3";
			colSm4.appendChild(clone);
			row.appendChild(colSm4);
			
		});
		
		root.appendChild(row);	
	}
	
	function clearContainer() {
		root.innerHTML = '';
	}
	
	function getHrefId(href) {
		return href.split('/').filter(function(v){return v;}).pop();
	}
	
	function filmPage(ctx) {
		if (jqxhr !== undefined) {
			jqxhr.abort();
		}
		clearContainer();
		addSpinner();
		removeSorter();
		var id = ctx.params.id;
		jqxhr = jQuery.getJSON('https://swapi.co/api/films/' + id)
		.done(function(response) {
			removeSpinner();
			renderFilm(response);
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
	}
	
	function renderFilm(film) {
		
		var template = document.getElementsByClassName('js-film-template')[0];
			
			var clone = document.importNode(template.content, true);
			
			clone.querySelector('.js-title').textContent = film.title;
			clone.querySelector('.js-episode').textContent = film.episode_id;
			clone.querySelector('.js-director').textContent = film.director;
			clone.querySelector('.js-producer').textContent = film.producer;
			clone.querySelector('.js-release-date').textContent = film.release_date;
			
			/* var str = ''; 
			film.characters.forEach(function(character, i){
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.href = film.characters[i];
				a.textContent = film.characters[i];
				li.appendChild(a);
				clone.querySelector('.js-characters').appendChild(li);
			});
			
			clone.querySelector('.js-opening-crawl').textContent = film.opening_crawl;

			root.appendChild(clone); */
			
			
			var str = '';
			
			film.characters.forEach(function(character, i){
				var li = document.createElement('li');
				var a = document.createElement('a');
				var url = film.characters[i];
				a.href = film.characters[i];
				if (film.characters.length - i == 1) {
					getNameOfLastCharacter(str, url);
				}
				 else getNameOfCharacter(str, url);
			});
			
			characters = clone.querySelector('.js-characters');
			
			clone.querySelector('.js-opening-crawl').textContent = film.opening_crawl;

			root.appendChild(clone);
		
	}
		
	function getNameOfLastCharacter(str, url){
		jQuery.getJSON(url)
		.done(function(response) {
			str += '<li><a href="' + url + '">' +response.name+ '</a></li>';
			
			var li = document.createElement('li');
			li.innerHTML = str;
			characters.appendChild(li);
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
	} 
	
	function getNameOfCharacter(str, url){
		jQuery.getJSON(url)
		.done(function(response) {
			str += '<li><a href="' + url + '">' +response.name+ '</a>,</li>';
			
			var li = document.createElement('li');
			li.innerHTML = str;
			characters.appendChild(li);
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
	} 	
	
 	
	
	function addSorter() {
		document.getElementsByClassName('nav-filter')[0].classList.remove("invisible");
	}
	
	function addSpinner() {
		var template = document.getElementsByClassName('js-spinner')[0];
		var clone = document.importNode(template.content, true);
		
		root.appendChild(clone);
	}
	
	function removeSorter() {
		document.getElementsByClassName('nav-filter')[0].classList.add("invisible");
	}
	
	function removeSpinner() {
		document.getElementsByClassName('spinner')[0].remove();
	}
	
	function charactersPage() {
		if (jqxhr !== undefined) {
			jqxhr.abort();
		}
		clearContainer();
		addSpinner();
		removeSorter();
		jqxhr = jQuery.getJSON('https://swapi.co/api/people/')
		.done(function(response) {
			removeSpinner ();
			renderCharacters(response.results);
			console.log('It is ok');
		})
		.fail(function(jqXHR, textStatus) {
			console.log('Request failed:', textStatus)
		});
	}
	
	function renderCharacters(characters) {
		var template = document.getElementsByClassName('js-character-card-template')[0];
		var row = document.createElement('div');
		row.className = "row";
		characters.forEach(function createCharacterCard(character, i) {
			
			var clone = document.importNode(template.content, true);
			var numberCharacter = getHrefId(character.url);
			
			clone.querySelector('.js-url').href = "/characters/" + numberCharacter;
			clone.querySelector('.js-url').setAttribute('data-url', character.url);
			clone.querySelector('.js-character-name').textContent = character.name;
					
			var colSm4 = document.createElement('div');
			colSm4.className = "col-6 col-sm-4 col-md-3";
			colSm4.appendChild(clone);
			row.appendChild(colSm4);
			
		});
		
		root.appendChild(row);	
	}
	
	function notFoundPage() {
		clearContainer();
		removeSorter();
		console.log('page is not found');
		page.redirect('/');
	}

	function createMenu(menu) {
		
		var links =  menu.getElementsByTagName('a');
		var activeLink = links[0];
		
		activeLink.classList.add('active');
		
		menu = getElement(menu);
		
		for (var i = 0; i < links.length; i++) { 
			links[i].addEventListener('click', clickHandler);
		}
		
		function clickHandler() {
			makeActive(this);
		}
		
		function makeActive(currentLink) {		
			activeLink.classList.remove('active');
			currentLink.classList.add('active');
			activeLink = currentLink;
		}

		function getElement(el) {
			if (typeof el === 'string') {
				return document.querySelector(el);
			} else {
				return el;
			}
		}
		
		function makeActiveLinkByHref(href) {
			for (var i = 0; i < links.length; i++) {
				if (links[i].getAttribute('href') == href) {
					makeActive(links[i]);
				}
			}
		}
		
		return {
			makeActiveLinkByHref: makeActiveLinkByHref
		}
	}
	
	var menu = createMenu(document.getElementsByClassName('menu')[0]);
	var logo = document.getElementsByClassName('logo')[0];
	
	logo.addEventListener('click', function() {
		menu.makeActiveLinkByHref('/');
	});
})();
