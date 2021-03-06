import Component from "../core/component";
import {apiService} from "../services/api.service";
import {TransformService} from "../services/transform.service";
import {renderPost} from "../templates/post.template";


 export class PostComponent extends Component{
    constructor(id, {loader}) {
        super(id);
        this.loader = loader;
    }

    init(){
        this.$el.addEventListener('click', buttonHandler.bind(this));
    }

    async onShow(){
        this.loader.show();
        const fbData = await apiService.fetchPost();
        const posts = TransformService.fbObjectToArray(fbData);
        const html = posts.map(post => renderPost(post, {withButton: true}));
        this.loader.hide();
        this.$el.insertAdjacentHTML('afterbegin', html .join(' '));
    }

    onHide() {
        this.$el.innerHTML = '';
    }
}

function buttonHandler(event){
    const $el = event.target;
    const  id = $el.dataset.id;

    if (id) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) ||  [];

        if (favorites.includes(id)){
            favorites = favorites.filter(fId => fId !== id);
            $el.classList.add('button-primary');
            $el.classList.remove('button-danger');
            $el.textContent = 'Сохранить';
        } else {
            $el.classList.remove('button-primary');
            $el.classList.add('button-danger');
            $el.textContent = 'Удалить';
            favorites.push(id);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

}