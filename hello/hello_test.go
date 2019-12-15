package hello

import "testing"

func TestHello(t *testing.T) {
	actual := Say()
	expect := "hello"
	if actual != expect {
		t.Fatalf("failed test \nexpect: %s\nactual: %s", expect, actual)
	}
}
