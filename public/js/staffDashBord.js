document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('ul li');
    const active =document.querySelector('.active')

    navItems.forEach(item => {
      item.addEventListener('mouseover', () => {
        item.classList.add('active');
        active.classList.remove('active');
        active=item;
        
      });
      item.addEventListener('mouseout', () => {
        if (item!==active) {
          item.classList.remove('active' )
          
        }
        active.addEventListener('mouseover',()=>{
          active.classList.add('active');
        })
        
      });
    });
  });