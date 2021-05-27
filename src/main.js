import './styles/styles.scss'
import './js/import_img'
import * as $ from 'jquery'
import 'slick-carousel'

/*BURGER menu in header*/
const iconHeaderMenu = document.querySelector('.icon-menu');
const menuHeaderBody = document.querySelector('.menu__body');
const body = document.querySelector('body');
const section = document.querySelectorAll('section');
const iconsMenu = document.querySelectorAll('.menu__link > img')

iconHeaderMenu.addEventListener('click', openHeaderMenuBurger);
window.addEventListener('resize', iconsOnWindowResize);

// function open burger menu
function openHeaderMenuBurger(){
    iconHeaderMenu.classList.toggle('active');
    menuHeaderBody.classList.toggle('active');
    iconsOnWindowResize();
    body.classList.toggle('lock');
    section.forEach(item => item.classList.toggle('hidden'));
}
//function listen window resize and clean icons menu for burger
function iconsOnWindowResize(){
    if (window.outerWidth > 1050){
        iconsMenu.forEach(item => item.classList.remove('active'))  
    } 
    else {
        iconsMenu.forEach(item => item.classList.add('active'))
    }
}

//slider
if($('.slider__body').length>0){
    $('.slider__body').slick({
        //slidesToShow: 1.5,
        variableWidth: true,
        centerMode: true,
        asNavFor: ".slider__body__main",
        centerPadding: '46% 0% 0%',
        appendArrows: $('.class-arrow'),
        prevArrow: '<button id="prev" type="button" class="btn btn-arrow btn-arrow_prev"></button>',
        nextArrow: '<button id="next" type="button" class="btn btn-arrow btn-arrow_next"></button>',
        responsive: [
        {
            breakpoint: 1420,
            settings: {
                centerPadding: '20% 0% 0%',
            }
        },
        {
            breakpoint: 1000,
            settings: {
                centerPadding: '10% 0% 0%',
            }
        },
        {
            breakpoint: 480,
            settings: {
            }
        }
        ]
    })
}
$('.slider__body__main').slick({
    arrows: true,
    fade: true,
    //asNavFor: ".slider__body",
});


//menu scroll up
let lastScrollTop = 0;
window.addEventListener("scroll", function(){ 
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > 96 && st > lastScrollTop){
      // downscroll
        document.getElementById("header").style.top = "-100%";
    } else {
      // upscroll
        document.getElementById("header").style.top = "0";
    }
   lastScrollTop = st <= 0 ? 0 : st; // for mobile or negative scrolling
}, false);

//MODAL ORDER & form & tooltip
const closeBtnMakeOrder = document.querySelector('.order__close_link');
const modalWindowMakeOrder = document.querySelector('#order-modal');
const overlay = document.querySelector('#overlay-modal');
const formMakeOrder = document.querySelector('#order-form');


//listeners
formMakeOrder.addEventListener('submit', formSendOrder);
document.body.addEventListener('click', openModalWindowMakeOrder);
closeBtnMakeOrder.addEventListener('click', closeModalWindowMakeOrder);
document.body.addEventListener('keyup', closeModalMakeOrderOnEscBtn);
overlay.addEventListener('click', closeModalWindowOnWindowClick);

//FUNCTIONS
//open modal order	
function openModalWindowMakeOrder(e){
    if (e.target.classList.contains('btn-order-modal')){
        modalWindowMakeOrder.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
//close modal order on close link
function closeModalWindowMakeOrder(){
    modalWindowMakeOrder.classList.remove('active');
    console.log(modalWindowMakeOrder.classList)
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
//close modal on esc
function closeModalMakeOrderOnEscBtn(e) {
    var key = e.keyCode;	
    if (key == 27 && document.querySelector('.order__modal.active')) {
        document.querySelector('.order__modal.active').classList.remove('active');
        document.querySelector('.overlay.active').classList.remove('active');
    }
}
//close modal on document
function closeModalWindowOnWindowClick() {
    if(document.querySelector('.order__modal.active')){
        document.querySelector('.order__modal.active').classList.remove('active');
    }
    this.classList.remove('active');
    document.body.style.overflow = '';
}

const tultipWindow = document.querySelector('#tultip');
const closeBtnTultip = document.querySelector('.tultip__close_link');

closeBtnTultip.addEventListener('click', closeTultip);
document.addEventListener('click', closeTultipOnWindowClick);
document.body.addEventListener('click', openTultip);

//open tultip	
function openTultip(e){
    if (e.target.classList.contains('details__point') || e.target.classList.contains('details__point_in')){
        tultipWindow.classList.add('active');
    }
}
//close tultip on close link
function closeTultip(){
    tultipWindow.classList.remove('active');
}
//close tultip on document
function closeTultipOnWindowClick(e){    
        if (!e.target.closest('.tultip') && !e.target.classList.contains('details__point') && !e.target.classList.contains('details__point_in')) { 
            if (tultipWindow.classList.contains('active')){
                tultipWindow.classList.remove('active'); 
        }
    }
}

//form sending
async function formSendOrder(e){
    e.preventDefault();
    let error = formValidate(formMakeOrder);
    let formData = new FormData(formMakeOrder);
    if (error === 0) {
        //ajax require file sendmail.php!!!
        let response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
        });            
        formMakeOrder.reset();
        closeModalWindowMakeOrder();
        } else {
        alert('Заполните обязательные поля');    
    }
}	
//form validations
function formValidate(form){
    let error = 0;
    let formReq = document.querySelectorAll('._req');
    console.log(formReq);
    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemoveError(input);
        if (input.classList.contains('_phone')){
            if (phoneTest(input)){
                formAddError(input);
                error++;
            }
        } else if(input.getAttribute("type") === "checkbox" && input.checked === false){
            formAddError(input);
            error++;
        } else if (input.value === ''){
            formAddError(input);
            error++;
        }
    }
    return error;            
} 

//add error
function formAddError(input){
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}
//remove error
function formRemoveError(input){
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}
//phone number validation
function phoneTest(input){
    return !/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/i.test(input.value);
}