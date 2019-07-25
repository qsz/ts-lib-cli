/**
 * This script runs automatically after your first npm-install.
 */
const { mv, rm, which, exec } = require("shelljs")
const replace = require("replace-in-file")
const colors = require("colors")
const path = require("path")
const { readFileSync, writeFileSync } = require("fs")

// Note: These should all be relative to the project root directory
const rmFiles = [
  "tools/init.ts"
]
const modifyFiles = [
  "LICENSE",
  "package.json",
  "rollup.config.ts",
  "test/library.test.ts",
  "example/index.html"
]
const renameFiles = [
  ["src/library.ts", "src/--libraryname--.ts"],
  ["test/library.test.ts", "test/--libraryname--.test.ts"]
]

// Clear console
process.stdout.write('\x1B[2J\x1B[0f');

// Say hi!
console.log(
  colors.cyan("Hi! You're almost ready to make the next great TypeScript library.")
)

setupLibrary(libraryNameSuggested())

function libraryNameSuggested() {
  return path
    .basename(path.resolve(__dirname, ".."))
    .replace(/[^\w\d]|_/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}


/**
 * Calls all of the functions needed to setup the library
 * 
 * @param libraryName
 */
function setupLibrary(libraryName: string) {
  console.log(
    colors.cyan(
      "\nThanks for the info. The last few changes are being made... hang tight!\n\n"
    )
  )
  // Get the Git username and email before the .git directory is removed
  let username = ''
  let usermail = ''
  if (which("git")) {
    username = exec("git config user.name").stdout.trim()
    usermail = exec("git config user.email").stdout.trim()
    console.log("\n")
  } 
  removeItems()
  modifyContents(libraryName, username, usermail)
  renameItems(libraryName)
  finalize()
  console.log(colors.cyan("OK, you're all set. Happy coding!! ;)\n"))
}

/**
 * Removes items from the project that aren't needed after the initial setup
 */
function removeItems() {
  console.log(colors.underline.white("Removed"))

  // The directories and files are combined here, to simplify the function,
  // as the 'rm' command checks the item type before attempting to remove it
  let rmItems = rmFiles
  rm("-rf", rmItems.map(f => path.resolve(__dirname, "..", f)))
  console.log(colors.red(rmItems.join("\n")))
  console.log("\n")
}

/**
 * Updates the contents of the template files with the library name or user details
 * 
 * @param libraryName 
 * @param username 
 * @param usermail 
 */
function modifyContents(libraryName: string, username: string, usermail: string) {
  console.log(colors.underline.white("Modified"))

  let files = modifyFiles.map(f => path.resolve(__dirname, "..", f))
  try {
    const changes = replace.sync({
      files,
      from: [/--libraryname--/g, /--username--/g, /--usermail--/g],
      to: [libraryName, username, usermail]
    })
    console.log(colors.yellow(modifyFiles.join("\n")))
  } catch (error) {
    console.error("An error occurred modifying the file: ", error)
  }

  console.log("\n")
}

/**
 * Renames any template files to the new library name
 * 
 * @param libraryName 
 */
function renameItems(libraryName: string) {
  console.log(colors.underline.white("Renamed"))

  renameFiles.forEach(function(files) {
    // Files[0] is the current filename
    // Files[1] is the new name
    let newFilename = files[1].replace(/--libraryname--/g, libraryName)
    mv(
      path.resolve(__dirname, "..", files[0]),
      path.resolve(__dirname, "..", newFilename)
    )
    console.log(colors.cyan(files[0] + " => " + newFilename))
  })

  console.log("\n")
}

/**
 * Calls any external programs to finish setting up the library
 */
function finalize() {
  console.log(colors.underline.white("Finalizing"))
  // Remove post-install command
  let jsonPackage = path.resolve(__dirname, "..", "package.json")
  const pkg = JSON.parse(readFileSync(jsonPackage) as any)

  // // Note: Add items to remove from the package file here
  delete pkg.scripts.postinstall
  delete pkg.devDependencies['shelljs']
  delete pkg.devDependencies['replace-in-file']
  delete pkg.devDependencies['colors']

  writeFileSync(jsonPackage, JSON.stringify(pkg, null, 2))
  console.log(colors.green("Postinstall script has been removed"))
  console.log(colors.green("shelljs devDependencies has been removed"))
  console.log(colors.green("replace-in-file devDependencies has been removed"))
  console.log(colors.green("colors devDependencies has been removed"))

  console.log("\n")
}
