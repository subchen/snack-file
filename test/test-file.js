var assert = require('chai').assert;
var file = require('../');

/* jshint mocha: true */
describe('snack-file', function() {

    before(function() {
        file.mkdirs('/tmp/test-file/');
    });

    after(function() {
        file.delete('/tmp/test-file/');
    });

    it('#exists()', function() {
        assert.strictEqual(file.exists('/etc/passwd'), true);
        assert.strictEqual(file.exists('/etc/passwd.notfound'), false);
    });

    it('#isFile()', function() {
        assert.strictEqual(file.isFile('/etc/passwd'), true);
        assert.strictEqual(file.isFile('/etc/ssh/'), false);
    });

    it('#isDirectory()', function() {
        assert.strictEqual(file.isDirectory('/etc/passwd'), false);
        assert.strictEqual(file.isDirectory('/etc/ssh/'), true);
    });

    it('#isSymbolicLink()', function() {
        assert.strictEqual(file.isSymbolicLink('/proc/self'), true);
        assert.strictEqual(file.isSymbolicLink('/proc/'), false);
    });

    it('#read()', function() {
        assert.isString(file.read('/etc/passwd'));
    });

    it('#readBuffer()', function() {
        assert.instanceOf(file.readBuffer('/etc/passwd'), Buffer);
    });

    it('#write()', function() {
        var name = '/tmp/test-file/node-test-file.js';
        var data = '123\nabc';
        file.write(name, data);
        assert.strictEqual(file.read(name), data);
    });

    it('#writeBuffer()', function() {
        var name = '/tmp/test-file/node-test-buffer.js';
        var data = new Buffer([31, 32, 33, 0, 200, 210]);
        file.writeBuffer(name, data);
        assert.deepEqual(file.readBuffer(name), data);
    });

    it('#mkdirs()', function() {
        var name = '/tmp/test-file/a/b/c/d';
        file.mkdirs(name);
        assert.strictEqual(file.exists(name), true);
    });

    it('#move()', function() {
        var name1 = '/tmp/test-file/1-move.tmp';
        var name2 = '/tmp/test-file/2-move.tmp';
        var data = '000';
        file.write(name1, data);
        file.move(name1, name2);
        assert.strictEqual(file.read(name2), data);
    });

    it('#copy()', function() {
        var name1 = '/tmp/test-file/1-copy.tmp';
        var name2 = '/tmp/test-file/2-copy.tmp';
        var data = '000';
        file.write(name1, data);
        file.copy(name1, name2);
        assert.strictEqual(file.read(name2), data);
    });

    it('#delete()', function() {
        var name = '/tmp/test-file/1-delete.tmp';
        file.write(name, '000');
        file.delete(name);
        assert.strictEqual(file.exists(name), false);
    });

    it('#size()', function() {
        var name = '/tmp/test-file/1-size.tmp';
        var data = '000-中文';
        file.write(name, data);
        assert.strictEqual(file.size(name), Buffer.byteLength(data));
    });

    it('#readJSON()', function() {
        var json = require('../package.json');
        var data = file.readJSON(__dirname + '/../package.json');
        assert.deepEqual(json, data);
    });
});
