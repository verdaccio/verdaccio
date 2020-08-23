/*
BAD CODE ALERT!

You should never reach out of one package and into another in a multi-package repository.
(doing so is a leading cause of 'works on my machine' but then failure when the packages are published)

We are doing it here to avoide adding a circular dependency and as this is only used in testing.

This is wicked, and please don't copy us.
*/

export { default } from "../../../cli/changelog";
