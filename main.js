function addCoins() {
  let currentCoins = localStorage.getItem('coins');
  currentCoins++;
  localStorage.setItem('coins', currentCoins);
  $('#coins').html(`<img src="assets/images/coin.gif"/> ${currentCoins}`);
}

$("#coins").on('click', function() {
  $('#food-menu').toggleClass('invisible');
});


// -----------------------FOOD---------------------------



$("#food-menu").on('click', '#bone', function () {
  if(localStorage.getItem('coins') >= 100) {
      localStorage.setItem('coins', localStorage.getItem('coins') - 100);
      spawnFood('bone');
      $('#food-menu').toggleClass('invisible');
  }  
});

$("#food-menu").on('click', '#steak', function () {
  if(localStorage.getItem('coins') >= 500) {
      localStorage.setItem('coins', localStorage.getItem('coins') - 500);
      spawnFood('steak');
      $('#food-menu').toggleClass('invisible');
  }
});

function eatFood(foodItem) {
  if (foodItem === 'bone') {
      let i = 1;
      while (i <= 3) {
          getFull();
          i++;
      }
  }
  if (foodItem === 'steak') {
      let i = 1;
      while (i <= 9) {
          getFull();
          i++;
      }
  }
}

function getFull() {
  let currentHunger = parseInt(localStorage.getItem('hunger'));
  if (currentHunger < 100) {
      currentHunger += 10;
  }
  localStorage.setItem('hunger', currentHunger);
  $('#hunger-meter').css('width', localStorage.getItem('hunger'));
}

function getHungry(){
  let currentHunger = parseInt(localStorage.getItem('hunger'));
  if (currentHunger >= 10) {
      currentHunger -= 10;
  }
  localStorage.setItem('hunger', currentHunger);
  $('#hunger-meter').css('width', localStorage.getItem('hunger'));
}

function spawnFood(foodItem) {
  let width = window.innerWidth;
  let spawnPos = Math.round(Math.random() * width);
  let div = document.createElement('div');
  div.id = `falling${foodItem}`;
  $('.bodyPage').append(div);
  $(`#${div.id}`).css('left',spawnPos);
  FOODCHECKER = setInterval(function(){
      moveFood(foodItem);
      checkCollision(foodItem);
  }
  ,500);
}

function moveFood(foodItem) {
  if (foodItem === 'bone') {
      let position = $(`#fallingbone`).position();
      $('#fallingbone').css('top', position.top + 10);
  }
  if (foodItem === 'steak') {
      let position = $(`#fallingsteak`).position();
      $('#fallingsteak').css('top', position.top + 10);
  }
}

function checkCollision(foodItem) {
  let petPos = $('#pet').position();
  let petTop = petPos.top;
  let foodPos = $(`#falling${foodItem}`).position();
  let foodHeight = $(`#falling${foodItem}`).height();
  let water = $('#water').position();
  if ((foodPos.top - foodHeight) > petTop) {
      eatFood(foodItem);
      $(`#falling${foodItem}`).remove();
      clearInterval(FOODCHECKER);
  }
  if ((foodPos.top + foodHeight) > water.top) {
      $(`#falling${foodItem}`).remove();
      clearInterval(FOODCHECKER);
      // console.log('no food for you pup');
  
  }
}

// ---------------------WEATHER---------------------------------

$("#weather-box").on('click', '#change-location', function(e) {
  // console.log('change');
  $('#update-weather').toggleClass('invisible');
});

$("#update").on('mouseup', function(e) {
  newCity = $("#city").val();
  newState = $("#state").val();
  localStorage.setItem('city', newCity);
  localStorage.setItem('state', newState);
  updateFromRemote();
});

function updateFromRemote() {
  let url = `http://api.wunderground.com/api/647cab7e22bd323e/geolookup/conditions/q/${localStorage.getItem('state')}/${localStorage.getItem('city').replace(/' '/g,'_')}.json`
  fetch(url, {
method: 'get'
  }).then(function(response) {
      return response.json();
  }).then(function(msgs) {
      localStorage.setItem('weather', msgs.current_observation.weather);
      localStorage.setItem('temp', msgs.current_observation.temp_f);
      localStorage.setItem('forecast', msgs.current_observation.forecast_url);
  }).then(function(){
      let html = `<strong>Current City:</strong> ${localStorage.getItem('city')}, ${localStorage.getItem('state')} <img src="assets/images/cog.png" id="change-location"/> <br> <strong>Temp:</strong> ${localStorage.getItem('temp')} °F <br> <strong>Weather:</strong> ${localStorage.getItem('weather')}<br><a href="${localStorage.getItem('forecast')}" target="new">View forecast on <img src="assets/images/wunderground.jpg"/></a>`;
      $('#weather').html(html);
  }).then(function() {
      changeWeather();
  }).then(function(){
      $('#weather').removeClass('hidden');
      $('#update-weather').addClass('invisible');
      setTimeout(function() {$('#loading').addClass('hidden');}, 250);
  })
  .catch(function(err) {
      console.log(err);
  });
}

function changeWeather() {
  let currentTime = new Date();
  let currentHour = currentTime.getHours();
  let weatherTypes = 'rainDay snowDay cloudyDay clearDay sunnyDay overcastDay hazeDay rainNight snowNight cloudyNight clearNight sunnyNight overcastNight hazeNight';
  $('#coins').css('color','#000000');
  $('#hunger').css('border', '1px solid black');
  $('#hunger-meter').css('background','black');
  $('#stats-box').css('color','black');
  if (currentHour > 6 && currentHour < 20) {
      if (localStorage.getItem('weather').includes('Overcast')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('overcastDay');
          $('#coins').css('color','#EEEEEE');
          $('#hunger').css('border', '1px solid #EEEEEE');
          // $('#hunger-meter').css('background','#EEEEEE');
          $('#stats-box').css('color','#EEEEEE');
      } else if (localStorage.getItem('weather').includes('Cloud')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('cloudyDay');
      } else if (localStorage.getItem('weather').includes('Rain')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('rainDay');
      } else if (localStorage.getItem('weather').includes('Sun')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('sunnyDay');
      } else if (localStorage.getItem('weather').includes('Clear')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('clearDay');
          // $('#coins').css('color','#EEEEEE');
          $('#hunger').css('border', '1px solid #EEEEEE');
          // $('#hunger-meter').css('background','#EEEEEE');
          // $('#stats-box').css('color','#EEEEEE');
      } else if (localStorage.getItem('weather').includes('Snow')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('snowDay');
      } else if (localStorage.getItem('weather').includes('Haze')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('hazeDay');
      }
  } else {
      if (localStorage.getItem('weather').includes('Overcast')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('overcastNight');
          $('#coins').css('color','#EEEEEE');
          $('#hunger').css('border', '1px solid #EEEEEE');
          // $('#hunger-meter').css('background','#EEEEEE');
          $('#stats-box').css('color','#EEEEEE');
      } else if (localStorage.getItem('weather').includes('Cloud')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('cloudyNight');
          $('#coins').css('color','#EEEEEE');
          $('#hunger').css('border', '1px solid #EEEEEE');
          // $('#hunger-meter').css('background','#EEEEEE');
          $('#stats-box').css('color','#EEEEEE');
      } else if (localStorage.getItem('weather').includes('Rain')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('rainNight');
      } else if (localStorage.getItem('weather').includes('Sun')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('sunnyNight');
      } else if (localStorage.getItem('weather').includes('Clear')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('clearNight');
          $('#coins').css('color','#EEEEEE');
          $('#hunger').css('border', '1px solid #EEEEEE');
          // $('#hunger-meter').css('background','#EEEEEE');
          $('#stats-box').css('color','#EEEEEE');
      } else if (localStorage.getItem('weather').includes('Snow')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('snowNight');
      } else if (localStorage.getItem('weather').includes('Haze')) {
          $("#container").removeClass(weatherTypes);
          $("#container").addClass('hazeDay');
      }
  }
}

// ------------------------PET----------------------------

// Swap direction the dog is facing when 
$(".bodyPage").mousemove(function(e) {
  let screenMid = Math.floor(window.innerWidth/2);
  if (e.pageX < screenMid) {
      // $('#pet').html('<img src="assets/images/dog_left.gif"/>');
      // $('#pet').html('<img src="assets/images/cat_right.gif"/>');
      $('#pet').css('transform', 'scaleX(1)');
  } else {
      // $('#pet').html('<img src="assets/images/dog_right.gif"/>');
      $('#pet').css('transform', 'scaleX(-1)');
  }
});

$("#pet").on('click', 'img', function(e) {
  let audio = document.createElement("audio");
  audio.setAttribute('src','assets/sounds/woof.wav');
  audio.play();
  $('#pet img').css('transform', 'translateY(-50px)');
  setTimeout(function(){
      $('#pet img').css('transform', 'translateY(0px)');
  }, 200);
});

$('.bodyPage').on('keydown', function(e) {
  // let currentSpeed = 10;
  let position = $('#pet').position();
  let positionOffset = $('#pet').offset();
  // console.log(positionOffset, "offset");
  // console.log(positionOffset.left, "left");
  // console.log('this is here', $('#pet').position());
  let screenWid = $(window).width();
  let petWidth = $('#pet').width();
  // let petOffPage = (positionOffset.left - (petWidth / 4));
  // console.log(screenWid, "screen width");

  let currentSpeed = 0;
  if (localStorage.getItem('hunger') > 70) {
      currentSpeed = 30;
  }
  else if (localStorage.getItem('hunger') > 20) {
      currentSpeed = 20;
  } else {
      currentSpeed = 10;
  }

  if (e.keyCode === 37) {
      position;
      $('#pet').css('transform', 'scaleX(1)')
      $('#pet').css('left', position.left - currentSpeed);
  }
  if (e.keyCode === 39) {
      position;
      $('#pet').css('transform', 'scaleX(-1)');
      $('#pet').css('left',position.left + currentSpeed);
      // console.log(positionOffset.left - (petWidth / 4), (screenWid / 2));
  }
  if (e.keyCode === 38) {
      $('#pet').css('transform', 'translateY(-50px)');
      setTimeout(function(){
          $('#pet').css('transform', 'translateY(0px)');
      }, 200);
  }
  if (positionOffset.left >= screenWid - 70) {
      // $('body').append($('pet'));
      $('#pet').css('left', position.left = -(screenWid / 2));
  }
  if (positionOffset.left <= (screenWid - screenWid) - 220) {
      $('#pet').css('left', position.left = (screenWid / 2));
  }
});


$(document).on('ready', () => {
  if (!localStorage.getItem('city')) {localStorage.setItem('city', '')};
  if (!localStorage.getItem('state')) {localStorage.setItem('state', '')};
  if (!localStorage.getItem('hunger')) {localStorage.setItem('hunger', '0')};
  if (!localStorage.getItem('coins')) {localStorage.setItem('coins', '0')};
  $('#coins').html(`<img src="assets/images/coin.gif"/> ${localStorage.getItem('coins')}`);
  $('#hunger-meter').css('width', localStorage.getItem('hunger'));
  setInterval(addCoins,500);
  setInterval(getHungry, 15000);
  if (localStorage.getItem('city') === "" && localStorage.getItem('state') === "") {
      $('#weather').addClass('hidden');
      $('#loading').addClass('hidden');
      $("#container").removeClass('rain snow cloudy clear sunny overcast');
      return;
  } 
  if (localStorage.getItem('city') && localStorage.getItem('state')) {
      $('#update-weather').toggleClass('invisible');
      updateFromRemote(); 
  }

  
});