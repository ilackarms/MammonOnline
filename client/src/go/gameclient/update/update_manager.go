package update

import (
	"github.com/gopherjs/gopherjs/js"
)

type updateFunc func(deltaObj *js.Object)
type renderFunc func()

type Manager struct {
	updateFuncs []updateFunc
	renderFuncs []renderFunc
}

func NewManager() *Manager {
	return &Manager{}
}

func (m *Manager) AddRenderFunc(f renderFunc) {
	m.renderFuncs = append(m.renderFuncs, f)
}

func (m *Manager) GetRenderFuncs() []renderFunc {
	return m.renderFuncs
}

func (m *Manager) AddUpdateFunc(f updateFunc) {
	m.updateFuncs = append(m.updateFuncs, f)
}

func (m *Manager) GetUpdateFuncs() []updateFunc {
	return m.updateFuncs
}
