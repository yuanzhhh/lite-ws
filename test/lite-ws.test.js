import initWorker from '../src';

describe('initWorker', () => {
    function target() {
        console.log('11111111111111111111')

        return '%%%%%%%%%%%%%%';
    }

    function cb(msg) {
        console.log(msg);
    }

    const ntarget = initWorker(target, cb);

    test('worker test', () => {
        ntarget();
        // expect(typeof onions(target, [beforeMiddleware], [afterMiddleware])).toBe('function');
        // expect(typeof onions(target, [], [afterMiddleware])).toBe('function');
        // expect(typeof onions(target, [beforeMiddleware], [])).toBe('function');
        // expect(typeof onions(target, [], [])).toBe('function');
        // expect(typeof onions(target, beforeMiddleware, afterMiddleware)).toBe('function');
    });
});
