import { BaseCommand } from '../../base';
export default class SellDollar extends BaseCommand {
    static description: string;
    static args: ({
        name: string;
        required: boolean;
        description: string;
    } | {
        name: string;
        required: boolean;
        description?: undefined;
    })[];
    static examples: string[];
    run(): Promise<void>;
}
