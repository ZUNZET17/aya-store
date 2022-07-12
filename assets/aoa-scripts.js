// aoa custom scrtipts

/* Tabs script */

function openTab(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent-cus");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks-cus");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
document.getElementById("tab-cus-active").click();

//Accordions solo function

const AccordionSolo = function (ev) {
  const input = ev.currentTarget;
  const currentAccordion = input.parentElement;
  const parentClass = Array.from(currentAccordion.classList)[0]
  const accordionArr = Array.from(document.querySelectorAll('.' + parentClass));
  if (!currentAccordion.getAttribute('open')) {
    accordionArr.forEach(a => {
      if( a == currentAccordion ) return;
      a.removeAttribute('open');
    })
  }

  //currentAccordion.setAttribute(open)
}

//Trigger Product Info
const TriggerProductInfo = (ev) => {
  const input = ev.currentTarget.classList.contains('js-on-image-text-mobile-trigger') ? ev.currentTarget : ev.currentTarget.parentElement.nextElementSibling ;
  const onImageTextContent = input.classList.contains('js-on-picture-close') ? input.closest('div') : input.previousElementSibling;

  onImageTextContent.classList.toggle('active')
  input.classList.toggle('active')
}

//Product Thumb Zoom
function updateCords (ev) {
    const input = ev.target;
    let xCord = (ev.offsetX / input.width) * 100;
    let yCord = (ev.offsetY / input.height) * 100;
    const zoomedImg = input.zoomedImage

    zoomedImg.style.backgroundSize = 100 * input.zoomAmount + '%'
    zoomedImg.style.backgroundPosition = `${xCord}% ${yCord}%`
}

const ZoomThumbs = (ev) => {
  const input = ev.target;
  const inputHeight = input.offsetHeight;
  const inputWidth = input.offsetWidth;
  const zoomAmount = document.querySelector('.js-zoom-image-amount').getAttribute('x-amount')
  const zoomedImg = input.querySelector('.js-zoom-image')

  input.classList.toggle('zoomed')
  zoomedImg.classList.toggle('active-zoom')

  input.onmouseleave = () => {
    zoomedImg.style.backgroundPosition = `50% 50%`
    input.removeEventListener('mousemove', updateCords)
    zoomedImg.classList.remove('active-zoom')
  }
  input.height = inputHeight
  input.width = inputWidth
  input.zoomAmount = zoomAmount
  input.zoomedImage = zoomedImg
  input.addEventListener('mousemove', updateCords)
}

//Request Page Section
const RequestPageSection = function (ev) { 
  const input = ev.currentTarget;
  const pageId = input.getAttribute('page-id');
  let pageContent;  
  function handleResponse() {
    pageContent = JSON.parse(this.responseText);
    let container = document.createElement( 'html' );
    container.innerHTML = pageContent[pageId]
    document.querySelector(`.js-page-${pageId}`).appendChild(container)
  }
  if ( document.querySelector(`.js-page-${pageId} > html`) ) return
  const request = new XMLHttpRequest();
  
  request.addEventListener('load', handleResponse);
  request.open('GET', `/?sections=${pageId}`, true);
  request.send()
}

/*
###################
Set Event Listeners
###################
*/

//AccordionSolo
const accordionSummaries = document.querySelectorAll('.js-accordion-summary')

accordionSummaries.forEach(label => {
  label.addEventListener('click', AccordionSolo, false)
})

//TriggerProduct Info

const triggers = document.querySelectorAll('.js-on-image-text-mobile-trigger')
const xs = document.querySelectorAll('.js-on-picture-close')
triggers.forEach(t => {
  t.addEventListener('click', TriggerProductInfo, false)
})
xs.forEach(x => {
  x.addEventListener('click', TriggerProductInfo, false)
})

//ZoomThumbs
let windowSize = window.matchMedia("(max-width: 750px)")

const thumbsArr = Array.from(document.querySelectorAll('.js-zoom-thumb'));
if (windowSize.matches) {
  console.log('less than 990px')
}else {
  thumbsArr.forEach(t => {
    t.addEventListener('click', ZoomThumbs)
  })
}

//RequestPageSection
if ( document.querySelector('.js-page-content') ) {
  const popUpButtons = document.querySelectorAll('.js-pop-up-button');
  popUpButtons.forEach(btn => {
    btn.addEventListener('click', RequestPageSection, false)
  });
}

//Poruct Bundle option accordion

const bundleAccordion = function (ev) {
  const selectValue = this.querySelector('select').value
  const variantRadios = this.querySelectorAll('variant-radios-bundle')
  const displaySelected = this.parentElement.querySelector('.selection-span')

  variantRadios.forEach( v => {
    let product = v.getAttribute('data-product')
    v.classList.add('js-none')
    if (selectValue == product) {
      v.classList.remove('js-none')
    }
  })

  displaySelected.textContent = this.querySelectorAll('variant-radios-bundle:not(.js-none)')[0].currentVariant.title

}

window.addEventListener('load', () => {
  document.querySelectorAll('.accordion__content--bundle').forEach(a => {
    a.addEventListener('change', bundleAccordion)
    a.dispatchEvent(new Event('change'))
  })
})