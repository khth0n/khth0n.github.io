const stylesheets = '/public/stylesheets';

const themeMap = new Map<string, string>([
    [ `${stylesheets}/style.css`, 'default' ],
    [ `${stylesheets}/tamu-style.css`, 'TAMU' ]
]);

export class ThemeSelector extends HTMLElement {

    button: HTMLButtonElement;

    constructor() {
        super();

        this.button = document.createElement('button');
        this.button.innerHTML = 'Styling';

        this.append(this.button);

        let savedTheme = localStorage.getItem('theme');
        
        if(savedTheme) {
            let theme = document.getElementById('theme') as HTMLStyleElement;

            theme.setAttribute('href', savedTheme);
        }

        let themeOption: HTMLButtonElement;

        for(const [ fileURL, name ] of themeMap) {

            themeOption = document.createElement('button');
            themeOption.innerHTML = name;

            themeOption.addEventListener('click', (ev: MouseEvent) => {

                localStorage.setItem('theme', fileURL)
                let theme = document.getElementById('theme') as HTMLStyleElement;

                theme.setAttribute('href', fileURL);

                this.dispatchEvent(new MouseEvent('mouseout'));
            });

            themeOption.classList.add('hidden');

            this.append(themeOption);
        }

        this.button.addEventListener('click', (ev: MouseEvent) => {

            this.dispatchEvent(new MouseEvent('mouseover'));
        });

        this.addEventListener('mouseover', (ev: MouseEvent) => {

            let theme = (document.getElementById('theme') as HTMLStyleElement).getAttribute('href')!;
            let themeName = themeMap.get(theme);

            for(let element of this.getElementsByTagName('button')) {

                element.classList.remove('hidden');

                if(element.innerHTML === themeName) {

                    element.classList.add('current-theme');
                } else {

                    element.classList.add('option-theme');
                }
            }

            this.button.classList.add('hidden');
        });

        this.addEventListener('mouseout', (ev: MouseEvent) => {

            for(let element of this.getElementsByTagName('button')) {

                element.classList.add('hidden');
                element.classList.remove('current-theme');
                element.classList.remove('option-theme');
            }

            this.button.classList.remove('hidden');
        });
    }
}

customElements.define('ic-themes', ThemeSelector);