import { File } from './File';
import type { StyleFileExtension } from '../configuration';

/*
    import './MyComponent.css';
    import styles from './MyComponent.module.css';

    import './MyComponent.scss';
    import styles from './MyComponent.module.scss';
*/

export class StyleFile extends File<StyleFileExtension> {
    constructor(name: string, extension: StyleFileExtension) {
        super(`${name}.module`, 'scss');
    }

    getContent(): string {
        return '';
    }
}
