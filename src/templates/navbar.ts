const origin = window.location.origin;

const pageMap = new Map<string, string>([
    [ `${origin}/`, 'Landing' ],
    [ `${origin}/projects/`, 'Projects' ],
    [ `${origin}/demos/`, 'Demos' ],
    [ `${origin}/qualifications/`, 'Qualifications' ],
    [ `${origin}/service/`, 'Service' ],
    //[ `${origin}/ai-generated/`, 'AI Generated' ]
])

export class Navbar extends HTMLElement {

    constructor() {
        super();

        let collapseButton = document.createElement('button');
        collapseButton.innerHTML = 'Collapse'

        collapseButton.addEventListener('click', (ev: MouseEvent) => {

            let elements = this.getElementsByTagName('a');

            for(let element of elements) {

                if(element.classList.contains('collapsed')) {

                    
                    this.classList.remove('rolled');
                    element.classList.remove('collapsed');
                    collapseButton.innerHTML = 'Collapse';
                } else {

                    this.classList.add('rolled');
                    element.classList.add('collapsed');
                    collapseButton.innerHTML = 'Expand';
                }
            }
        });

        //this.append(collapseButton);

        for(const [ pageURL, pageName ] of pageMap) {

            let navbarElement = document.createElement('a');
            navbarElement.classList.add('ic-navbar-element');

            navbarElement.href = pageURL;
            navbarElement.innerHTML = pageName;
            navbarElement.classList.add('ic-navbar-element-link');

            if(pageURL == window.location.href) {

                navbarElement.classList.add('ic-navbar-element-current');
            }

            this.append(navbarElement);
        }

        let themeSelector = document.createElement('ic-themes');

        //this.append(themeSelector)
    }
}

customElements.define('ic-navbar', Navbar);