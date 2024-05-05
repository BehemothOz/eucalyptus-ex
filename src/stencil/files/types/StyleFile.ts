import { File } from '../File';

type StyleFileExtension = 'css' | 'scss';

/*
    import './MyComponent.css';
    import styles from './MyComponent.module.css';

    import './MyComponent.scss';
    import styles from './MyComponent.module.scss';
*/

export class StyleFile extends File<StyleFileExtension> {
    constructor(name: string) {
        super(`${name}.module`, 'scss');
    }

    getContent(): string {
        return '';
    }
}
