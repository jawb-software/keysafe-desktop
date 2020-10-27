import React from 'react';
import '../UIToolBar.css';
import I18n from "../../../Basic/I18n/i18n";
import {
    USER_ACTION_CATEGORY_SELECTED,
    USER_ACTION_NEW_CATEGORY
} from "../../../Basic/consts";
import {getCurrentTheme} from "../../../Basic/utils";

class UICategoryList extends React.Component {

    constructor(props) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
        this.onCreateCategoryClicked = this.onCreateCategoryClicked.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onFilterCategoryKeyDown = this.onFilterCategoryKeyDown.bind(this);
        this.state = {
            categoryFilter: '',
            categories: props.categoryList,
            currentCategoryId: props.currentCategoryId,
        };
        this.platform = process.platform;
    }

    onCreateCategoryClicked(e){
        this.props.onUserAction(USER_ACTION_NEW_CATEGORY);
    }

    selectCategory(e){
        const categoryId = e.target.id;
        this.props.onUserAction(USER_ACTION_CATEGORY_SELECTED, categoryId);
        this.setState({selectedCategoryId: categoryId})
    }

    onFilterCategoryKeyDown(e){
        const self = this;
        if (e.key === 'Escape' || e.keyCode === 27) {
            this.setState({categoryFilter: ''});
        }
    }

    handleInput(event) {

        const filter = event.target.value;

        this.setState({categoryFilter: filter});

        const allCategories  = this.state.categories;
        for (let i = 0; i < allCategories.length; i++) {
            let category = allCategories[i];

            const li = document.getElementById(category.id);
            if(li){
                if (category.name.toLowerCase().indexOf(filter) >= 0) {
                    li.style.display = 'block';
                } else {
                    li.style.display = 'none';
                }
            }

        }
    }

    onMouseOver(e){
        const el = document.getElementById(e.target.id);
        el.style.backgroundColor = getCurrentTheme().COLOR_NAVIGATION_LIST_ITEM_HOVER_BACKGROUND;
    }

    onMouseOut(e){
        const el = document.getElementById(e.target.id);
        el.style.backgroundColor = 'transparent';
    }

    render() {

        const self           = this;
        const textSearch     = I18n.categoryList_Search();
        const selected       = this.state.currentCategoryId;
        const allCategories  = this.state.categories;
        const filterTerm     = this.state.categoryFilter.toLowerCase();
        let categoriesToShow = [];
        const needFilter     = allCategories.length && allCategories.length > 4;

        const theme          = getCurrentTheme();

        const textCatItemClr = theme.COLOR_NAVIGATION_LIST_CATEGORY_ITEM_NAME;

        const styleCatSelected = {
            backgroundColor : theme.COLOR_NAVIGATION_LIST_SELECTED_ITEM_BACKGROUND,
            borderLeft : '4px solid ' + theme.COLOR_NAVIGATION_LIST_SELECTED_ITEM_BORDER,
            color: theme.COLOR_NAVIGATION_LIST_SELECTED_ITEM_TEXT
        };

        if(filterTerm){
            for (let i = 0; i < allCategories.length; i++) {
                let category = allCategories[i];

                if (category.name.toLowerCase().startsWith(filterTerm, 0)) {
                    categoriesToShow.push(category);
                }
            }
        } else {
            categoriesToShow = allCategories;
        }


        let lis = categoriesToShow.map(function(item){
            const catName = item.name;
            if(item.id === selected){
                return <li key={item.id} className="Category-Selected" style={styleCatSelected}>{catName}</li>;
            } else {
                return <li key={item.id} id={item.id} onMouseOut={self.onMouseOut} onMouseOver={self.onMouseOver} onClick={self.selectCategory} style={{color:textCatItemClr}}>{catName}</li>;
            }
        });

        const top = this.platform === 'win32' ? '79px' : '50px';

        const categoryListStyle = {
            backgroundColor: theme.COLOR_NAVIGATION_OPENED_BACKGROUND,
            top : top,
            height : 'calc(100% - ' + top + ')'
        };

        const filterInputStyle = {
            backgroundColor: theme.COLOR_NAVIGATION_LIST_SEARCH_INPUT_BACKGROUND,
            // visibility : needFilter ? 'visible' : 'hidden'
        };

        return (
            <div id="category-list" style={ categoryListStyle }>

                <input value={this.state.categoryFilter} onKeyDown={this.onFilterCategoryKeyDown} style={filterInputStyle} onChange={this.handleInput.bind(this)} placeholder={textSearch} />

                <div id="category-list-items">
                    <ul>
                        { categoriesToShow.length > 0
                            ? <ul>
                                { lis }
                                {!filterTerm && <li id={'new-cat'} onMouseOut={self.onMouseOut} onMouseOver={self.onMouseOver} style={{ color : theme.COLOR_ACCENT }} onClick={this.onCreateCategoryClicked} className={"Category-CreateNew"}>{I18n.categoryList_New()}</li>}
                              </ul>
                            : <div id="no-items"> {I18n.basic_NothingFound()} </div> }
                    </ul>
                </div>
            </div>
        );
    };
}

export default UICategoryList;
