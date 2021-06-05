package main

import (
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func TestEnvironment(t *testing.T) {
	assert.Equal(t, "TESTS", os.Getenv("MODE"))
}
