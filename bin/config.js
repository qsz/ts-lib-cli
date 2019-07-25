const path = require('path');
const resolve = function (file) {
    return path.resolve(__dirname, '..', 'program/' + file);
}

const basis_dependencies = {
    dirs: [resolve('src'), resolve('tools')],
    files: [],
    pkgJson: '',
    pkgOther: ''
}

const parcel_dependencies = {
    dirs: [resolve('example')],
    files: [],
    pkgJson: {
        devDependencies: {
            "parcel-bundler": "^1.12.3"
        },
        scripts: {
            "example": "parcel example/index.html"
        }
    },
    pkgOther: ''
}

const jest_dependencies = {
    dirs: [resolve('test')],
    files: [],
    pkgJson: {
        devDependencies: {
            "@types/jest": "^24.0.15",
            "jest": "^24.8.0",
            "jest-config": "^24.8.0",
            "ts-jest": "^24.0.2"
        },
        scripts: {
            "test": "jest --coverage",
            "test:watch": "jest --coverage --watch",
            "test:prod": "npm run lint && npm run test -- --no-cache"
        }
    },
    pkgOther: {
        "jest": {
            "transform": {
              ".(ts|tsx)": "ts-jest"
            },
            "testEnvironment": "node",
            "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
            "moduleFileExtensions": [
              "ts",
              "tsx",
              "js"
            ],
            "coveragePathIgnorePatterns": [
              "/node_modules/",
              "/test/"
            ],
            "coverageThreshold": {
              "global": {
                "branches": 90,
                "functions": 95,
                "lines": 95,
                "statements": 95
              }
            },
            "collectCoverageFrom": [
              "src/*.{js,ts}"
            ]
        }
    }
}

const ncu_dependencies = {
    dirs: '',
    files: [],
    pkgJson: {
        devDependencies: {
            "npm-check-updates": "^3.1.20"
        },
        scripts: {
            "ncu": "ncu -u",
        }
    },
    pkgOther: ''
}

const programPath = path.resolve(__dirname, '../', 'program') // 模版路径
const currentPath = process.cwd()                             // cli路径
console.log(process.cwd())

module.exports = {
    libDependencies: {
        basis_dependencies,
        parcel_dependencies,
        jest_dependencies,
        ncu_dependencies,
    },
    programPath,
    currentPath
}