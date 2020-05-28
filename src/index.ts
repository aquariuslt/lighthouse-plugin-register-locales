import { join } from 'path';

const resolve = (loc: string): string => join(__dirname, './', loc);

const plugin = {};

export = plugin;
