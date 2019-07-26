import { ElementMenu } from './element_menu';

export class Menu {
    category: string;
    elements_category: ElementMenu[];
    constructor(menu: Menu) {
        this.category = menu.category;
        
        this.elements_category = [];
        menu.elements_category.forEach(element => {
            this.elements_category.push(new ElementMenu(element));
          });
    }
}