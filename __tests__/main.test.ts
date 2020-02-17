import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import {tmpdir} from 'os'

let test_dir = ''

// TODO this is a lot of setup for tests that really only parse stdout.
// consider mocking exec.exec to produce fake Git output instead
beforeAll(() => {
  try {
    test_dir = fs.mkdtempSync(
      path.join(fs.realpathSync(tmpdir()), 'treeclean_tmp')
    )
    process.chdir(test_dir)
    cp.execSync('git init')
    cp.execSync('git config user.name "test user"')
    cp.execSync('git config user.email "nobody@example.com"')
    fs.writeFileSync('a.txt', 'abcde')
    cp.execSync('git add .')
    cp.execSync('git commit -m "first"')
  } catch (e) {
    console.log(e)
  }
})

afterAll(() => {
  fs.rmdirSync(test_dir, {recursive: true})
})

beforeEach(() => {
  try {
    cp.execSync('git checkout -- .')
  } catch (e) {
    console.log(e)
  }
})

function execute_action(consider_untracked: string) {
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  if (options.env) { // always true but shuts up Typescript "object may be undefined"
    options.env['INPUT_CONSIDER-UNTRACKED'] = consider_untracked
  }

  // cp.execSync throws if cmd status not zero,
  // but we want to inspect stdout in either case
  try {
    return {
      status: 0,
      msg: cp.execSync(`node ${ip}`, options).toString()
    }
  } catch (e) {
    return {
      status: e.status,
      msg: e.stdout.toString()
    }
  }
}

test('clean env', () => {
  var out = execute_action('true')
  expect(out.status).toBe(0)
  expect(out.msg).toMatch(new RegExp('^\\[command\\].*--porcelain\\s*$'))
})

test('modified file', () => {
  fs.appendFileSync('a.txt', 'fghi')
  var out = execute_action('true')
  expect(out.status).not.toBe(0)
  expect(out.msg).toMatch('::error::')
  expect(out.msg).toMatch('M a.txt')
})

test('new file', () => {
  fs.writeFileSync('b.txt', 'this is a new file')
  // consider-untracked should be treated as true if unset
  var out_implicit = execute_action('')
  expect(out_implicit.status).not.toBe(0)
  expect(out_implicit.msg).toMatch('::error::')
  expect(out_implicit.msg).toMatch('?? b.txt')

  var out_explicit = execute_action('true')
  expect(out_explicit).toEqual(out_implicit)
  expect(out_explicit.msg).toMatch('::error::')
  expect(out_explicit.msg).toMatch('?? b.txt')

  var out = execute_action('false')
  expect(out.status).toBe(0)
  expect(out.msg).not.toMatch('::error::')
  expect(out.msg).not.toMatch('b.txt')
})

test('new plus modified', () => {
  fs.writeFileSync('b.txt', 'ignorable content here')
  fs.appendFileSync('a.txt', 'jklm')

  var out = execute_action('true')
  expect(out.status).not.toBe(0)
  expect(out.msg).toMatch(new RegExp('M a.txt\\s+\\?\\? b.txt\\s+::error::'))

  out = execute_action('false')
  expect(out.status).not.toBe(0)
  expect(out.msg).toMatch('M a.txt')
  expect(out.msg).not.toMatch('?? b.txt')
})
